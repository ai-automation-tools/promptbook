/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useReducer } from 'react';
import { type Prompt } from '../components/PromptCard';

/**
 * The starred items, from both libraries.
 *
 * Favorites are one list of ids, but the app only loads the current library's
 * listing, so a star from the other library used to vanish when you switched.
 * Those are fetched one by one (`GET /api/prompts/:id`) and cached for the
 * session. An id that no longer resolves (deleted, or a My Library id on the
 * read-only demo) is left out, not unstarred.
 */
const fetched = new Map<string, Prompt | null>();

export function useFavoritePrompts(favorites: string[], prompts: Prompt[]): Prompt[] {
  const [version, bump] = useReducer((n: number) => n + 1, 0);
  const loaded = useMemo(() => new Map(prompts.map(p => [p.id, p])), [prompts]);
  const missingKey = favorites.filter(id => !loaded.has(id) && !fetched.has(id)).join('\n');

  useEffect(() => {
    if (!missingKey) return;
    let live = true;
    Promise.all(missingKey.split('\n').map(id =>
      fetch(`/api/prompts/${encodeURIComponent(id)}`)
        .then(res => (res.ok ? res.json() as Promise<Prompt> : null))
        .catch(() => null)
        .then(prompt => { fetched.set(id, prompt); }),
    )).then(() => { if (live) bump(); });
    return () => { live = false; };
  }, [missingKey]);

  return useMemo(
    () => favorites.map(id => loaded.get(id) ?? fetched.get(id)).filter((p): p is Prompt => !!p),
    // `version` is the dependency that tracks `fetched`.
    [favorites, loaded, version],
  );
}
