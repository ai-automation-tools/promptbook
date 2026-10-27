/**
 * The six library sections plus Skill Packs: one record each with its tab id,
 * `library/` folder, label, icon, accent colour and blurb. Every component that
 * used to switch on a tab id reads from here instead.
 *
 * The accents are the per-tool hues from the org landing page
 * (ai-automation-tools.dev): rose is Promptbook's own colour there, and
 * the rest follow the same family so the sections read as siblings. They are
 * token references, not literals, so html.light can swap each for its 700
 * shade; index.css also exposes the current one as `--c` via `[data-section]`.
 */

import {
  BookOpen,
  Bot,
  Package,
  Plug,
  Sparkles,
  TerminalSquare,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { LibraryTab } from '../hooks/useLibraryRoute';

export interface SectionMeta {
  /** Tab id, also the `?section=` value. */
  id: LibraryTab;
  /** Value of `data-section` on <html>; drives `--section-c`. */
  slug: string;
  label: string;
  /** One-word label under the rail icon. */
  short: string;
  /** What the hero's first counter counts ("Servers", "Skills"), capitalised. */
  noun: string;
  /** Folder under `library/`; empty for Skill Packs, which are served separately. */
  folder: string;
  icon: LucideIcon;
  accent: string;
  description: string;
}

export const SECTIONS: readonly SectionMeta[] = [
  {
    id: 'prompt-library',
    slug: 'prompts',
    label: 'Prompts',
    short: 'Prompts',
    noun: 'Prompts',
    folder: '4_Prompts',
    icon: Sparkles,
    accent: 'var(--sec-prompts)',
    description: 'Reusable prompt templates, organised by domain and task.',
  },
  {
    id: 'agents',
    slug: 'agents',
    label: 'Agents',
    short: 'Agents',
    noun: 'Agents',
    folder: '2_Agents',
    icon: Bot,
    accent: 'var(--sec-agents)',
    description: 'Installable subagent definitions, ready to drop into .claude/agents/.',
  },
  {
    id: 'agent-guides',
    slug: 'guides',
    label: 'Guides',
    short: 'Guides',
    noun: 'Guides',
    folder: '1_Guides',
    icon: BookOpen,
    accent: 'var(--sec-guides)',
    description: 'Setup and usage guides for the tools and providers the prompts target.',
  },
  {
    id: 'system-prompts',
    slug: 'system-prompts',
    label: 'System Prompts',
    short: 'System',
    noun: 'System prompts',
    folder: '5_System_Prompts',
    icon: TerminalSquare,
    accent: 'var(--sec-system-prompts)',
    description: 'An archive of production system prompts, for study and reuse.',
  },
  {
    id: 'skills',
    slug: 'skills',
    label: 'Skills',
    short: 'Skills',
    noun: 'Skills',
    folder: '3_Skills',
    icon: Wrench,
    accent: 'var(--sec-skills)',
    description: 'SKILL.md bundles with their sample code, downloadable as a zip.',
  },
  {
    id: 'mcp-servers',
    slug: 'mcp',
    label: 'MCP Servers',
    short: 'MCP',
    noun: 'Servers',
    folder: '6_MCP_Servers',
    icon: Plug,
    accent: 'var(--sec-mcp)',
    description: 'Model Context Protocol servers worth installing, with verified install lines.',
  },
  {
    id: 'skill-packs',
    slug: 'skill-packs',
    label: 'Skill Packs',
    short: 'Packs',
    noun: 'Packs',
    folder: '',
    icon: Package,
    accent: 'var(--sec-skill-packs)',
    description: 'Curated collections of skills for a domain or workflow.',
  },
];

/** The rail and phone strip: Skill Packs is reached from the Skills switch, not its own tile. */
export const NAV_SECTIONS = SECTIONS.filter(s => s.id !== 'skill-packs');

/** The nav tile a tab lights up: Skill Packs lives under Skills. */
export function navTab(tab: LibraryTab): LibraryTab {
  return tab === 'skill-packs' ? 'skills' : tab;
}

/** Legacy tab spellings still accepted from old links. */
const LEGACY_TABS: Record<string, LibraryTab> = {
  guides: 'agent-guides',
  prompts: 'prompt-library',
};

export function getSection(tab: string): SectionMeta {
  const id = LEGACY_TABS[tab] ?? tab;
  return SECTIONS.find(s => s.id === id) ?? SECTIONS[0];
}

export function getSectionFolder(tab: string): string {
  return getSection(tab).folder;
}

export function getSectionDisplayName(tab: string): string {
  return getSection(tab).label;
}

/** The tab a `library/` folder (a prompt's `section` field) belongs to. */
export function getTabForFolder(folder: string): LibraryTab {
  return SECTIONS.find(s => s.folder && s.folder === folder)?.id ?? 'prompt-library';
}

/** Human form of a `Some_Category_Name` folder segment. */
export function humanize(segment: string | null | undefined): string {
  return (segment ?? '').replace(/_/g, ' ');
}

/** Lower-case a label for running text, keeping acronyms ("MCP Servers" → "MCP servers"). */
export function lowerLabel(label: string): string {
  return label.split(' ').map(w => (/^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase())).join(' ');
}

/** Hues (oklch degrees) a category can take; index.css turns one into `--c` via `.hue`. */
const CATEGORY_HUES = [15, 45, 80, 120, 160, 185, 210, 240, 270, 295, 330, 355];

/** A stable hue for a category name, so it wears the same colour in the sidebar and on its cards. */
export function categoryHue(name: string): number {
  // FNV-1a: a plain *31 hash mod 12 leans on the last letter and bunches the hues.
  let h = 0x811c9dc5;
  for (const ch of name) h = Math.imul(h ^ ch.charCodeAt(0), 0x01000193) >>> 0;
  return CATEGORY_HUES[h % CATEGORY_HUES.length];
}
