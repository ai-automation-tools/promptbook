import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { READ_ONLY } from '../lib/mode';

/**
 * Favorites: starred My Library items and Skill Packs (`pack:<id>`). They live
 * on the server, in My Library's favorites.json, so every browser and device
 * that reaches it sees the same stars. They used to be in localStorage, which a
 * browser keeps per address: 127.0.0.1, localhost and a Tailscale name each had
 * a list of their own. A browser that still holds that old list sends it up
 * once, on its first load, and drops it.
 *
 * The read-only demo has no My Library and so no favorites: the list stays empty.
 */

const API = '/api/my-library/favorites';
const LEGACY_KEY = 'prompt-favorites';
/** The server's id rule. Public Library stars (library paths) were dropped 2026-11-09. */
const FAVORITE_ID = /^(pack:)?[a-z0-9-]{1,200}$/;

function legacyFavorites(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(LEGACY_KEY) || '[]');
    return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string' && FAVORITE_ID.test(id)) : [];
  } catch {
    return [];
  }
}

async function send(init?: RequestInit, path = ''): Promise<string[]> {
  const res = await fetch(API + path, init);
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || 'Could not save favorites');
  return data.favorites;
}

const add = (ids: string[]) =>
  send({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids }) });

export function useFavorites(onError: (message: string) => void) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const latest = useRef(favorites);
  latest.current = favorites;

  const reload = useCallback(async () => {
    if (READ_ONLY) return;
    try {
      const legacy = legacyFavorites();
      const list = legacy.length ? await add(legacy) : await send();
      try { localStorage.removeItem(LEGACY_KEY); } catch { /* storage blocked: nothing to drop */ }
      setFavorites(list);
    } catch {
      // Keep what is shown; the next focus tries again.
    }
  }, []);

  // On load, and whenever the tab comes back, so stars made on another device show up.
  useEffect(() => {
    void reload();
    const onVisible = () => { if (document.visibilityState === 'visible') void reload(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [reload]);

  const toggleFavorite = useCallback((id: string, e?: MouseEvent) => {
    e?.stopPropagation();
    const starred = latest.current.includes(id);
    const flip = (on: boolean) => setFavorites(prev => (on ? [...prev.filter(x => x !== id), id] : prev.filter(x => x !== id)));
    flip(!starred); // shown at once, taken back if the server refuses
    (starred ? send({ method: 'DELETE' }, `/${encodeURIComponent(id)}`) : add([id])).catch((err: unknown) => {
      flip(starred);
      onError(err instanceof Error ? err.message : 'Could not save favorites');
    });
  }, [onError]);

  return { favorites, toggleFavorite, reloadFavorites: reload };
}
