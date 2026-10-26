/**
 * ⌘K command palette: jump to any prompt in the loaded library, switch
 * section, create a prompt, or change theme — from the keyboard. The same
 * device the org landing page ships.
 *
 * Mounted only while open, so the Fuse index is built on open (a few ms for
 * 3,200 rows) and thrown away on close.
 */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Fuse from 'fuse.js';
import { ArrowRight, Clock, CornerDownLeft, Moon, Plus, Search, Settings, Sun } from 'lucide-react';
import { m } from 'motion/react';
import { cn } from '../lib/cn';
import { SECTIONS, getTabForFolder, humanize } from '../lib/sections';
import type { Theme } from '../hooks/useTheme';
import type { LibraryTab } from '../hooks/useLibraryRoute';
import type { Prompt } from './PromptCard';
import { extractEmoji } from './PromptCard';
import { Kbd } from './ui/primitives';
import { READ_ONLY } from '../lib/mode';

interface CommandPaletteProps {
  prompts: Prompt[];
  recentPrompts: Prompt[];
  onClose: () => void;
  onSelectPrompt: (prompt: Prompt) => void;
  onSelectSection: (tab: LibraryTab) => void;
  onNewPrompt: () => void;
  onOpenSettings: () => void;
  onSetTheme: (theme: Theme) => void;
}

interface Item {
  key: string;
  group: 'Recent' | 'Prompts' | 'Sections' | 'Actions' | 'Themes';
  label: string;
  hint?: string;
  accent?: string;
  icon?: ReactNode;
  run: () => void;
}

const MAX_PROMPT_RESULTS = 14;

export default function CommandPalette({
  prompts,
  recentPrompts,
  onClose,
  onSelectPrompt,
  onSelectSection,
  onNewPrompt,
  onOpenSettings,
  onSetTheme,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(prompts, {
        keys: [
          { name: 'title', weight: 10 },
          { name: 'tags', weight: 3 },
          { name: 'category', weight: 2 },
          { name: 'subcategory', weight: 2 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [prompts],
  );

  const accentFor = (prompt: Prompt) =>
    SECTIONS.find(s => s.id === getTabForFolder(prompt.section))?.accent ?? 'var(--accent)';

  const promptItem = (prompt: Prompt, group: Item['group']): Item => {
    const { emoji, title } = extractEmoji(prompt.title);
    return {
      key: `${group}:${prompt.id}`,
      group,
      label: title,
      hint: [humanize(prompt.category), humanize(prompt.subcategory)].filter(Boolean).join(' / '),
      accent: prompt.isUserOwned ? 'var(--accent)' : accentFor(prompt),
      icon: emoji ? <span className="text-sm leading-none">{emoji}</span> : undefined,
      run: () => onSelectPrompt(prompt),
    };
  };

  const items = useMemo<Item[]>(() => {
    const q = query.trim();
    const sections: Item[] = SECTIONS.map(s => ({
      key: `section:${s.id}`,
      group: 'Sections',
      label: `Browse ${s.label}`,
      hint: s.description,
      accent: s.accent,
      icon: <s.icon className="h-3.5 w-3.5" />,
      run: () => onSelectSection(s.id),
    }));
    const actions: Item[] = [
      ...(READ_ONLY ? [] : [{
        key: 'action:new',
        group: 'Actions' as const,
        label: 'New item',
        hint: 'Create a prompt, agent, skill or guide in My Library',
        icon: <Plus className="h-3.5 w-3.5" />,
        run: onNewPrompt,
      }]),
      {
        key: 'action:settings',
        group: 'Actions',
        label: 'Settings',
        hint: 'Appearance, colour palette, local data',
        icon: <Settings className="h-3.5 w-3.5" />,
        run: onOpenSettings,
      },
    ];
    const themes: Item[] = (
      [
        { id: 'light', label: 'Light theme', icon: Sun },
        { id: 'dark', label: 'Dark theme', icon: Moon },
      ] as const
    ).map(t => ({
      key: `theme:${t.id}`,
      group: 'Themes',
      label: t.label,
      icon: <t.icon className="h-3.5 w-3.5" />,
      run: () => onSetTheme(t.id),
    }));

    if (!q) {
      return [...recentPrompts.slice(0, 5).map(p => promptItem(p, 'Recent')), ...sections, ...actions];
    }

    const lower = q.toLowerCase();
    const matchedPrompts = fuse.search(q, { limit: MAX_PROMPT_RESULTS }).map(r => promptItem(r.item, 'Prompts'));
    const matchedSections = sections.filter(s => s.label.toLowerCase().includes(lower));
    const matchedActions = actions.filter(a => a.label.toLowerCase().includes(lower));
    const matchedThemes = themes.filter(t => t.label.toLowerCase().includes(lower) || 'theme'.startsWith(lower));
    return [...matchedPrompts, ...matchedSections, ...matchedActions, ...matchedThemes];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, fuse, recentPrompts]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${selected}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selected]);

  const run = (item: Item) => {
    onClose();
    item.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(items.length - 1, s + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(0, s - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = items[selected];
      if (item) run(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  let lastGroup: Item['group'] | null = null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center px-4 pt-[12vh]">
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 bg-[var(--scrim)] backdrop-blur-[3px]"
        onClick={onClose}
      />
      <m.div
        role="dialog"
        aria-modal="true"
        aria-label="Search the library"
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 460, damping: 36, mass: 0.7 }}
        className="popover relative w-full max-w-[600px] overflow-hidden"
        onKeyDown={onKeyDown}
      >
        <div className="flex h-[52px] items-center gap-3 border-b border-[var(--line)] px-4">
          <Search className="h-4 w-4 shrink-0 text-[var(--fg-4)]" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search prompts, sections, actions…"
            aria-label="Search"
            aria-activedescendant={items[selected] ? `pal-${selected}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-controls="pal-list"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-[15px] text-[var(--fg)] outline-none placeholder:text-[var(--fg-4)]"
          />
          <Kbd>esc</Kbd>
        </div>

        <div ref={listRef} id="pal-list" role="listbox" className="max-h-[400px] overflow-y-auto p-1.5">
          {items.length === 0 && (
            <p className="px-3 py-10 text-center text-[13.5px] text-[var(--fg-4)]">
              Nothing matches “{query}”.
            </p>
          )}
          {items.map((item, i) => {
            const header = item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;
            const active = i === selected;
            return (
              <div key={item.key}>
                {header && (
                  <p className="eyebrow px-2.5 pb-1 pt-2.5 text-[10.5px]">
                    {header === 'Recent' ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3 w-3" /> Recent
                      </span>
                    ) : (
                      header
                    )}
                  </p>
                )}
                <button
                  type="button"
                  id={`pal-${i}`}
                  role="option"
                  aria-selected={active}
                  data-index={i}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => run(item)}
                  style={{ ['--c' as string]: item.accent ?? 'var(--fg-5)' }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-[var(--r-md)] px-2.5 py-2 text-left text-[14px] transition-colors',
                    active ? 'bg-[var(--tint)] text-[var(--fg)]' : 'text-[var(--fg-2)]',
                  )}
                >
                  <span
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] text-[var(--c)]"
                    style={{ background: 'color-mix(in srgb, var(--c) 12%, transparent)' }}
                  >
                    {item.icon ?? <span className="h-2 w-2 rounded-full bg-[var(--c)]" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.hint && (
                    <span className="mono hidden max-w-[45%] truncate text-[11px] text-[var(--fg-5)] sm:block">
                      {item.hint}
                    </span>
                  )}
                  {active ? (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--fg-4)]" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-transparent" />
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-[var(--line)] px-4 py-2 text-[11px] text-[var(--fg-5)]">
          <span className="flex items-center gap-1">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <Kbd>↵</Kbd> open
          </span>
          <span className="mono ml-auto">{prompts.length.toLocaleString()} prompts indexed</span>
        </div>
      </m.div>
    </div>
  );
}
