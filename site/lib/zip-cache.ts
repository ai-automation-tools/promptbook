import { ZipArchive } from 'archiver';

/**
 * A ZIP of library files, built once per process and served from memory after that
 * (PB-28: the largest skill took ~1.2 s to zip on every download). The library only
 * changes with a deploy or a restart, which is when the index reloads too, so the
 * cache never outlives the files it was built from.
 * ponytail: unbounded Map; the skills and packs are a few MB together. Add an LRU if
 * downloads ever cover user-controlled content.
 */
const built = new Map<string, Promise<Buffer>>();

export function cachedZip(key: string, add: (archive: ZipArchive) => void | Promise<void>): Promise<Buffer> {
  let zip = built.get(key);
  if (!zip) {
    zip = (async () => {
      // zlib default: measured 40% faster than 9 on the largest skill for 0.15% more bytes
      const archive = new ZipArchive({ zlib: { level: 6 } });
      const chunks: Buffer[] = [];
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      const ended = new Promise<void>((resolve, reject) => {
        archive.on('end', resolve);
        archive.on('error', reject);
      });
      await add(archive);
      await archive.finalize();
      await ended;
      return Buffer.concat(chunks);
    })();
    built.set(key, zip);
    zip.catch(() => built.delete(key)); // a failed build is retried, not cached
  }
  return zip;
}
