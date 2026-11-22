/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useReducer } from 'react';
import { type Prompt } from '../components/PromptCard';

/**
 * Fills in the card blurb for the prompts currently on screen.
 *
 * `GET /api/prompts?lightweight=true` used to embed a 200-character preview for
 * every prompt in the library — 632 KB of a 2.2 MB response, 221 KB of it after
 * gzip, more than the entire JS bundle. Nothing that operates on the whole
 * listing (search, tags, categories, sort, pagination) reads `content`; only the
 * ~50 cards actually rendered do. So the listing ships metadata and each grid
 * asks for the handful of previews it needs.
 *
 * The cache is module-level rather than per-hook because three grids (featured,
 * the paginated list, the subcategory list) mount at once and overlap; a
 * per-instance cache would request the same ids two and three times over.
 */
const previewCache = new Map<string, string>();
const inFlight = new Map<string, Promise<unknown>>();

/** One page is 50; the subcategory list is unpaginated, so requests are chunked. */
const BATCH_SIZE = 200;

function loadBatch(ids: string[]): Promise<void> {
  const request = fetch('/api/prompts/previews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  })
    .then(res => (res.ok ? res.json() : {}))
    .then((map: Record<string, string>) => {
      // Cache misses as '' too — an id the server cannot resolve should not be
      // re-requested on every render.
      for (const id of ids) previewCache.set(id, map[id] ?? '');
    })
    .catch(err => {
      // A blurb is decoration; a failed fetch leaves the card without one rather
      // than surfacing an error. Do not poison the cache — let it retry.
      console.error('Failed to fetch prompt previews:', err);
    })
    .finally(() => {
      for (const id of ids) {
        if (inFlight.get(id) === request) inFlight.delete(id);
      }
    });

  for (const id of ids) inFlight.set(id, request);
  return request;
}

function fetchPreviews(ids: string[]): Promise<unknown> {
  const pending = new Set<Promise<unknown>>();
  const needed: string[] = [];

  for (const id of ids) {
    const existing = inFlight.get(id);
    if (existing) pending.add(existing);
    else needed.push(id);
  }

  for (let i = 0; i < needed.length; i += BATCH_SIZE) {
    pending.add(loadBatch(needed.slice(i, i + BATCH_SIZE)));
  }

  return Promise.all([...pending]);
}

/** What a card shows when its item has no preview text (or the server had none for it). */
export const NO_PREVIEW = 'No preview available.';

/**
 * Returns `prompts` with `content` populated from the preview cache.
 *
 * Prompts that already carry content (My Library items, which arrive inline) are
 * passed through untouched and never trigger a request.
 */

export function usePromptPreviews(prompts: Prompt[]): Prompt[] {
  const [version, bumpVersion] = useReducer((n: number) => n + 1, 0);

  // Joined rather than passed as an array so the effect keys off the ids
  // themselves; a new array with the same contents must not refetch.
  const missingKey = prompts
    .filter(p => !p.content && !previewCache.has(p.id))
    .map(p => p.id)
    .join('\n');

  useEffect(() => {
    if (!missingKey) return;
    let active = true;
    fetchPreviews(missingKey.split('\n')).then(() => {
      if (active) bumpVersion();
    });
    return () => {
      active = false;
    };
  }, [missingKey]);

  return useMemo(
    // A miss is cached as '' and shown as NO_PREVIEW, so the card stops shimmering (BUG-13).
    () => prompts.map(p => (p.content ? p : { ...p, content: previewCache.has(p.id) ? previewCache.get(p.id) || NO_PREVIEW : '' })),
    // `version` is the dependency that tracks previewCache mutation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prompts, version],
  );
}
