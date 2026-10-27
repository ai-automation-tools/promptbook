import { useEffect, useState } from 'react';

/**
 * Appearance: a Light | Dark mode (the house-style switch) and a theme
 * (`palette`) that washes the ground, panels and lines in one hue and sets the accent. `html.light` / `html.dark` carry
 * the mode's token set and `html[data-palette]` the accent; index.html applies
 * both before first paint under the same keys, so the defaults here must match
 * the defaults there.
 */
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'my-prompt-library.theme';
export const THEME_DEFAULT: Theme = 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains('light') ? 'light' : THEME_DEFAULT,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#fafafa' : '#060606');
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  return [theme, setTheme] as const;
}

/* ----- Colour palette ----- */

export type Palette =
  | 'sky' | 'violet' | 'emerald' | 'ember' | 'wine' | 'ocean'
  | 'slate' | 'sand' | 'solar' | 'synthwave' | 'sakura' | 'mono';

export interface PaletteMeta {
  id: Palette;
  name: string;
  /** One line for the picker's caption. */
  note: string;
  /** The hue the ground is washed in (index.css --tone); null keeps the plain zinc set. */
  tone: string | null;
  /** Accent, dark and light, so the picker paints before a theme applies. */
  dark: string;
  light: string;
}

/** Ids match the `html[data-palette]` blocks in index.css (and index.html's pre-paint list). */
export const PALETTES: readonly PaletteMeta[] = [
  { id: 'sky', name: 'Sky', note: 'The house default', tone: null, dark: '#38bdf8', light: '#0369a1' },
  { id: 'violet', name: 'Midnight', note: 'Violet on deep purple', tone: '#7c3aed', dark: '#a78bfa', light: '#6d28d9' },
  { id: 'emerald', name: 'Forest', note: 'Emerald on pine', tone: '#059669', dark: '#34d399', light: '#047857' },
  { id: 'ember', name: 'Ember', note: 'Orange on charcoal', tone: '#ea580c', dark: '#fb923c', light: '#c2410c' },
  { id: 'wine', name: 'Wine', note: 'Rose on burgundy', tone: '#be123c', dark: '#fb7185', light: '#be123c' },
  { id: 'ocean', name: 'Ocean', note: 'Cyan on navy', tone: '#1d4ed8', dark: '#22d3ee', light: '#1d4ed8' },
  { id: 'slate', name: 'Slate', note: 'Ice blue on steel', tone: '#475569', dark: '#93c5fd', light: '#334155' },
  { id: 'sand', name: 'Sand', note: 'Amber on espresso', tone: '#a16207', dark: '#fbbf24', light: '#92400e' },
  { id: 'solar', name: 'Solar', note: 'Yellow on deep teal', tone: '#0f766e', dark: '#facc15', light: '#0f766e' },
  { id: 'synthwave', name: 'Synthwave', note: 'Hot pink on indigo', tone: '#6d28d9', dark: '#f472b6', light: '#a21caf' },
  { id: 'sakura', name: 'Sakura', note: 'Blossom pink', tone: '#db2777', dark: '#f9a8d4', light: '#be185d' },
  { id: 'mono', name: 'Mono', note: 'Greyscale, no colour', tone: '#71717a', dark: '#f4f4f5', light: '#18181b' },
];

export const PALETTE_KEY = 'my-prompt-library.palette';
export const PALETTE_DEFAULT: Palette = 'sky';

export function isPalette(value: string | null | undefined): value is Palette {
  return PALETTES.some(p => p.id === value);
}

export function usePalette() {
  const [palette, setPalette] = useState<Palette>(() => {
    const current = document.documentElement.getAttribute('data-palette');
    return isPalette(current) ? current : PALETTE_DEFAULT;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (palette === PALETTE_DEFAULT) root.removeAttribute('data-palette');
    else root.setAttribute('data-palette', palette);
    try {
      localStorage.setItem(PALETTE_KEY, palette);
    } catch {
      /* storage unavailable */
    }
  }, [palette]);

  return [palette, setPalette] as const;
}
