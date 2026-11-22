import type { VercelRequest, VercelResponse } from '../lib/vercel-types.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from '../lib/frontmatter.js';
import { cachedZip } from '../lib/zip-cache.js';
import { myLibrary, READ_ONLY } from '../lib/my-library.js';
import { carriedFrontmatter, EDGE_CACHE, LIBRARY_PATH } from '../lib/library.js';
import { filesUnder, resolveInside } from '../lib/safe-path.js';

// Recursively get all files in a directory
/**
 * A manifest's `library/…` skill path, contained like any other library path:
 * null when it climbs out with `..` or through a link.
 */
const packPath = (p: string) =>
  (p.startsWith('library/') ? resolveInside(LIBRARY_PATH, p.slice('library/'.length)) : null);

// App root. Resolve from this file, not process.cwd(): on Vercel the function
// runs with cwd=/var/task while the app (Root Directory = site) is bundled at
// /var/task/site, so cwd-based paths miss library/ entirely.
const APP_ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const packsDir = path.join(APP_ROOT, 'library/3_Skills/packs');


// A pack is "in My Library" while any of its skills are: add-to-library tags
// every skill it copies, so the tag is the install record.
const installTag = (packId: string) => `skill-pack:${packId}`;

const READ_ONLY_ERROR = { error: 'This copy of the library is read-only. Clone the repo to keep your own prompts.' };


async function getAllPackFiles(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return getAllPackFiles(fullPath);
    }
    return entry.name.endsWith('.json') && entry.name !== 'package.json' ? [fullPath] : [];
  }));
  return files.flat();
}

/** A pack manifest as stored in library/3_Skills/packs/**.json. */
export interface SkillPack {
  id: string;
  name: string;
  description: string;
  icon?: string;
  version?: string;
  author?: string;
  generated?: boolean;
  tags: string[];
  category: string;
  skills: { path: string; name: string; description?: string }[];
  created_at?: string;
  updated_at?: string;
}

// Helper to read all pack files
// Pack manifests are library files: read once per process (PB-28), like the prompt index.
let packsLoaded: Promise<SkillPack[]> | null = null;
export function getAllPacks(): Promise<SkillPack[]> {
  return (packsLoaded ??= readAllPacks());
}

async function readAllPacks(): Promise<SkillPack[]> {
  try {
    const packFiles = await getAllPackFiles(packsDir);
    
    const packs = await Promise.all(
      packFiles.map(async (filePath) => {
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      })
    );
    
    return packs;
  } catch (error) {
    console.error('Error reading packs:', error);
    packsLoaded = null; // retry on the next request rather than serve "no packs" for good
    return [];
  }
}

// Helper to resolve skill paths and read skill metadata
async function resolveSkillData(skillPath: string) {
  try {
    const fullPath = packPath(skillPath);
    if (!fullPath) return null;
    const content = await fs.readFile(fullPath, 'utf-8');
    const { data } = matter(content);
    
    return {
      path: skillPath,
      name: data.name || data.title || 'Unnamed Skill',
      description: data.description || '',
      tags: data.tags || [],
      category: data.category || '',
      subcategory: data.subcategory || ''
    };
  } catch (error) {
    console.error(`Error reading skill at ${skillPath}:`, error);
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method, url } = req;
  const urlPath = new URL(url!, `http://${req.headers.host}`).pathname;
  // The demo's GETs are cached at Vercel's edge (EDGE_CACHE in lib/library.ts).
  if (READ_ONLY && method === 'GET') res.setHeader('Cache-Control', EDGE_CACHE);
  
  // GET /api/skill-packs - List all packs
  if (method === 'GET' && urlPath === '/api/skill-packs') {
    try {
      const packs = await getAllPacks();
      const libraryMode = (req.query.library as string) || 'public';
      let filtered = packs;

      if (libraryMode === 'my' && READ_ONLY) {
        filtered = [];
      } else if (libraryMode === 'my') {
        const tags = new Set(myLibrary.list().flatMap(p => p.tags));
        filtered = packs.filter(pack => tags.has(installTag(pack.id)));
      }

      const summary = filtered.map(pack => ({
        id: pack.id,
        name: pack.name,
        description: pack.description,
        icon: pack.icon,
        version: pack.version,
        tags: pack.tags,
        category: pack.category,
        skillCount: pack.skills.length,
        author: pack.author,
        created_at: pack.created_at,
        updated_at: pack.updated_at
      }));
      
      return res.status(200).json(summary);
    } catch (error) {
      console.error('Error fetching packs:', error);
      return res.status(500).json({ error: 'Failed to fetch skill packs' });
    }
  }
  

  const addMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/add-to-library$/);
  if (method === 'POST' && addMatch) {
    try {
      if (READ_ONLY) return res.status(403).json(READ_ONLY_ERROR);
      if (req.body?.confirm !== true) {
        return res.status(400).json({ error: 'Explicit confirmation required' });
      }

      const packId = decodeURIComponent(addMatch[1]);

      const packs = await getAllPacks();
      const pack = packs.find(p => p.id === packId);
      if (!pack) return res.status(404).json({ error: 'Pack not found' });

      const existing = myLibrary.list();
      const existingKeys = new Set(existing.map(p => `${p.title}::${p.section}::${p.category}`));

      // All or nothing: a skill that fails to read or save takes back the ones
      // this install already wrote, so a retry starts clean instead of half-done.
      const created: string[] = [];
      let skipped = 0;
      try {
        for (const skill of pack.skills) {
          const fullPath = packPath(skill.path);
          if (!fullPath) throw new Error(`Pack path outside the library: ${skill.path}`);
          const raw = await fs.readFile(fullPath, 'utf-8');
          const { data, content } = matter(raw);

          const title = data.name || data.title || skill.name || path.basename(fullPath, '.md');
          const section = '3_Skills';
          const category = data.category || pack.category || 'Skill Packs';
          const subcategory = data.subcategory || pack.name;
          const tags = Array.isArray(data.tags) ? data.tags : (Array.isArray(pack.tags) ? pack.tags : []);
          const tag = installTag(pack.id);
          const tagsWithInstall = tags.includes(tag) ? tags : [...tags, tag];

          const dedupeKey = `${title}::${section}::${category}`;
          if (existingKeys.has(dedupeKey)) {
            skipped++;
            continue;
          }

          created.push(myLibrary.create({ title, section, category, subcategory, tags: tagsWithInstall, content, extra: carriedFrontmatter(data) }).id);
          existingKeys.add(dedupeKey);
        }
      } catch (err) {
        for (const id of created) myLibrary.delete(id);
        throw err;
      }
      const added = created.length;

      return res.status(200).json({
        message: `Added ${added} skill${added === 1 ? '' : 's'} from ${pack.name}${skipped > 0 ? ` (${skipped} skipped)` : ''}`,
        added,
        skipped,
        packId,
      });
    } catch (error) {
      console.error('Error adding pack to library:', error);
      return res.status(500).json({ error: 'Failed to add pack to library' });
    }
  }

  const removeMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/remove-from-library$/);
  if (method === 'DELETE' && removeMatch) {
    try {
      if (READ_ONLY) return res.status(403).json(READ_ONLY_ERROR);
      if (req.body?.confirm !== true) {
        return res.status(400).json({ error: 'Explicit confirmation required' });
      }
      const packId = decodeURIComponent(removeMatch[1]);

      const packPrompts = myLibrary.list().filter(p => p.section === '3_Skills' && p.tags.includes(installTag(packId)));

      let removed = 0;
      for (const prompt of packPrompts) {
        if (myLibrary.delete(prompt.id)) removed++;
      }

      return res.status(200).json({
        message: `Removed ${removed} skill${removed === 1 ? '' : 's'} from My Library`,
        removed,
        packId,
      });
    } catch (error) {
      console.error('Error removing pack from library:', error);
      return res.status(500).json({ error: 'Failed to remove pack from library' });
    }
  }

  // GET /api/skill-packs/:packId - Get specific pack
  const packIdMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)$/);
  if (method === 'GET' && packIdMatch) {
    try {
      const packId = decodeURIComponent(packIdMatch[1]);
      
      // Check if it's the download endpoint
      if (packId.endsWith('/download')) {
        return res.status(404).json({ error: 'Invalid endpoint format' });
      }
      
      const packs = await getAllPacks();
      const pack = packs.find(p => p.id === packId);
      
      if (!pack) {
        return res.status(404).json({ error: 'Pack not found' });
      }
      
      // Resolve skill metadata for each skill in the pack
      const skillsWithData = await Promise.all(
        pack.skills.map(async (skill) => {
          const skillData = await resolveSkillData(skill.path);
          return {
            ...skill,
            metadata: skillData
          };
        })
      );
      
      // Return full pack with resolved skill data
      return res.status(200).json({
        ...pack,
        skills: skillsWithData.filter(s => s.metadata !== null)
      });
    } catch (error) {
      console.error('Error fetching pack:', error);
      return res.status(500).json({ error: 'Failed to fetch pack details' });
    }
  }
  
  // GET /api/skill-packs/:packId/download - Download pack as ZIP
  const downloadMatch = urlPath.match(/^\/api\/skill-packs\/([^\/]+)\/download$/);
  if (method === 'GET' && downloadMatch) {
    try {
      const packId = decodeURIComponent(downloadMatch[1]);
      const packs = await getAllPacks();
      const pack = packs.find(p => p.id === packId);
      
      if (!pack) {
        return res.status(404).json({ error: 'Pack not found' });
      }
      
      const zip = await cachedZip(`pack:${packId}`, async (archive) => {
        // Each skill's whole folder, under its folder name
        for (const skill of pack.skills) {
          const skillPath = packPath(skill.path);
          if (!skillPath) {
            console.error(`Skipping ${skill.path}: outside the library`);
            continue;
          }
          const skillDir = path.dirname(skillPath);
          const skillDirName = path.basename(skillDir);
          try {
            const stats = await fs.stat(skillDir);
            if (stats.isDirectory()) {
              const allFiles = filesUnder(skillDir);
              if (allFiles.length === 0) console.warn(`No files found in ${skillDir}`);
              for (const filePath of allFiles) {
                archive.file(filePath, { name: path.posix.join(skillDirName, path.relative(skillDir, filePath).split(path.sep).join('/')) });
              }
            } else {
              archive.file(skillPath, { name: path.posix.join(skillDirName, path.basename(skillPath)) });
            }
          } catch (err) {
            // One unreadable skill doesn't sink the pack
            console.error(`Error processing skill ${skill.path}:`, err);
          }
        }
        const packManifestPath = (await getAllPackFiles(packsDir)).find(file => path.basename(file) === `${packId}.json`);
        if (packManifestPath) archive.file(packManifestPath, { name: `${packId}.json` });
      });

      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${packId}.zip"`);
      res.status(200).send(zip);
      return;
    } catch (error) {
      console.error('Error creating pack download:', error);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Failed to create pack download' });
      }
    }
  }
  
  return res.status(404).json({ error: 'Not found' });
}
