import fs from "fs";
import path from "path";

/**
 * Resolve a caller-supplied relative path inside `root`, returning null if it
 * escapes.
 *
 * `path.join(root, userInput)` is NOT a containment check — "a/../../b" walks
 * straight out, and a `userInput.startsWith('a/')` guard on the raw string is
 * satisfied by "a/../../b" too. Resolve first, compare after.
 *
 * The string check can't see a symlink or junction under `root` that points
 * elsewhere, so for a path that exists the real paths are compared too. A path
 * that doesn't exist keeps the string check alone; reading it fails anyway.
 */
export function resolveInside(root: string, relPath: string): string | null {
  const base = path.resolve(root);
  const full = path.resolve(base, relPath);
  if (!isWithin(base, full)) return null;
  let real: string;
  try { real = fs.realpathSync.native(full); } catch { return full; }
  return isWithin(fs.realpathSync.native(base), real) ? full : null;
}

const isWithin = (base: string, p: string) => p === base || p.startsWith(base + path.sep);

/**
 * Regular files under `dir`, recursively. Symlinks and junctions are skipped,
 * so a link inside a skill folder can't pull files from outside into a ZIP or
 * a file listing.
 */
export function filesUnder(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) filesUnder(p, out);
    else if (e.isFile()) out.push(p);
  }
  return out;
}
