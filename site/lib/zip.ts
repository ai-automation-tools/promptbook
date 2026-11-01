import zlib from 'node:zlib';

/**
 * Just enough of a ZIP reader for a My Library import: stored and deflated
 * entries, read from the central directory. Archiver only writes ZIPs, and this
 * is the one place the app reads one, so it is a few dozen lines, not a dependency.
 *
 * Everything it does not understand is refused rather than guessed at: ZIP64,
 * encryption, other compression methods, a name that climbs out of the folder.
 * An entry is inflated with a hard output cap, so a small entry that claims a
 * small size cannot expand into gigabytes.
 */

export class ZipError extends Error {}

function fail(msg: string): never {
  throw new ZipError(msg);
}

export interface ZipEntry {
  name: string;
  data: Buffer;
}

const EOCD = 0x06054b50;
const CENTRAL = 0x02014b50;
const LOCAL = 0x04034b50;

/** `../x`, `/x`, `C:x` and backslashed names: anything that could leave the target folder. */
export const isUnsafeName = (name: string) =>
  name.includes('\\') || name.includes('\0') || name.startsWith('/') || /^[a-zA-Z]:/.test(name)
  || name.split('/').some(part => part === '..');

export function readZip(buf: Buffer, { maxEntries, maxEntryBytes }: { maxEntries: number; maxEntryBytes: number }): ZipEntry[] {
  // The end record sits in the last 22 bytes plus an optional comment of up to 64 KB.
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - 0xffff); i--) {
    if (buf.readUInt32LE(i) === EOCD) { eocd = i; break; }
  }
  if (eocd < 0) fail('Not a ZIP file');

  const count = buf.readUInt16LE(eocd + 10);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (count === 0xffff || cdOffset === 0xffffffff) fail('ZIP64 archives are not supported');
  if (count > maxEntries) fail(`More than ${maxEntries} entries`);

  const entries: ZipEntry[] = [];
  let p = cdOffset;
  for (let n = 0; n < count; n++) {
    if (p + 46 > buf.length || buf.readUInt32LE(p) !== CENTRAL) fail('Damaged ZIP: bad central directory');
    const flags = buf.readUInt16LE(p + 8);
    const method = buf.readUInt16LE(p + 10);
    const crc = buf.readUInt32LE(p + 16);
    const compSize = buf.readUInt32LE(p + 20);
    const size = buf.readUInt32LE(p + 24);
    const nameLen = buf.readUInt16LE(p + 28);
    const next = p + 46 + nameLen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf-8', p + 46, p + 46 + nameLen);
    p = next;

    if (isUnsafeName(name)) fail(`Refused: "${name}" points outside the library folder`);
    if (name.endsWith('/')) continue; // a folder entry
    if (flags & 1) fail(`"${name}" is encrypted`);
    if (size > maxEntryBytes) fail(`"${name}" is over ${Math.round(maxEntryBytes / 1024)} KB`);
    if (local + 30 > buf.length || buf.readUInt32LE(local) !== LOCAL) fail(`Damaged ZIP: "${name}"`);

    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    if (start + compSize > buf.length) fail(`Damaged ZIP: "${name}" is cut short`);
    const raw = buf.subarray(start, start + compSize);

    let data: Buffer;
    if (method === 0) data = Buffer.from(raw);
    else if (method === 8) {
      try {
        data = zlib.inflateRawSync(raw, { maxOutputLength: maxEntryBytes });
      } catch {
        fail(`"${name}" is over ${Math.round(maxEntryBytes / 1024)} KB or damaged`);
      }
    } else fail(`"${name}" uses an unsupported compression method`);

    if (data.length !== size || zlib.crc32(data) !== crc) fail(`Damaged ZIP: "${name}" fails its checksum`);
    entries.push({ name, data });
  }
  return entries;
}
