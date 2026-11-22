/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowDownAZ, ArrowUpZA, CalendarArrowDown, CalendarArrowUp, ChevronDown, Clock, Star, Tag, X } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../lib/cn';
import { humanize } from '../lib/sections';
import { type Prompt, extractEmoji } from './PromptCard';
import { type SortOption } from '../hooks/usePromptFilters';
import { Chip } from './ui/primitives';

type OpenDropdown = 'favorites' | 'recent' | 'tags' | 'sort' | null;

const SORT_OPTIONS: { id: SortOption; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'title-asc', label: 'Title A–Z', icon: ArrowDownAZ },
  { id: 'title-desc', label: 'Title Z–A', icon: ArrowUpZA },
  { id: 'modified-desc', label: 'Newest first', icon: CalendarArrowDown },
  { id: 'modified-asc', label: 'Oldest first', icon: CalendarArrowUp },
];

/** A pill that opens a popover panel beneath it. */
function Dropdown({
  icon,
  label,
  count,
  active,
  isOpen,
  onToggle,
  align = 'left',
  width = 'w-72',
  children,
}: {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  align?: 'left' | 'right';
  width?: string;
  children: ReactNode;
}) {
  return (
    <div className="filter-dropdown relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          'btn btn-outline btn-sm gap-1.5',
          (isOpen || active) && 'border-[color-mix(in_srgb,var(--accent)_45%,var(--line-2))] text-[var(--fg)]',
        )}
      >
        {icon}
        <span>{label}</span>
        {count !== undefined && count > 0 && (
          <span className="mono rounded-[4px] bg-[var(--tint-2)] px-1.5 py-0.5 text-[12px] leading-none text-[var(--accent)]">
            {count}
          </span>
        )}
        <ChevronDown className={cn('h-3 w-3 text-[var(--fg-4)] transition-transform', isOpen && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
            className={cn('popover absolute top-full z-50 mt-2 p-2', width, align === 'right' ? 'right-0' : 'left-0')}
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** The title/category rows inside the favorites and recently-viewed panels. */
function PromptPickerList({ prompts, onSelect }: { prompts: Prompt[]; onSelect: (prompt: Prompt) => void }) {
  return (
    <div className="max-h-80 space-y-0.5 overflow-y-auto">
      {prompts.map(prompt => {
        const { emoji, title } = extractEmoji(prompt.title);
        return (
          <button
            key={prompt.id}
            type="button"
            onClick={() => onSelect(prompt)}
            className="group flex w-full items-center gap-2.5 rounded-[var(--r-md)] px-2.5 py-2 text-left transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] bg-[var(--surface)] text-[12px]">
              {emoji ?? <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)]" />}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-[var(--fg-2)] group-hover:text-[var(--fg)]">{title}</span>
              <span className="mono block truncate text-[12px] text-[var(--fg-5)]">{humanize(prompt.category)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface PromptListToolbarProps {
  /** Prompts matching the current filters, across all pages. */
  totalCount: number;
  favoritePrompts: Prompt[];
  recentlyViewedPrompts: Prompt[];
  onPromptSelect: (prompt: Prompt) => void;
  allTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
}

/**
 * The row above the prompt list: result count, the favorites / recent / tag
 * filters and the sort menu. Owns only which dropdown is open; every value it
 * edits lives in `usePromptFilters`.
 */
export default function PromptListToolbar({
  totalCount,
  favoritePrompts,
  recentlyViewedPrompts,
  onPromptSelect,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
  sortOption,
  onSortChange,
}: PromptListToolbarProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [tagQuery, setTagQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [openDropdown]);

  const toggle = (name: Exclude<OpenDropdown, null>) => setOpenDropdown(prev => (prev === name ? null : name));
  const currentSort = SORT_OPTIONS.find(s => s.id === sortOption) ?? SORT_OPTIONS[0];
  const SortIcon = currentSort.icon;
  const visibleTags = tagQuery ? allTags.filter(t => t.toLowerCase().includes(tagQuery.toLowerCase())) : allTags;

  return (
    <div ref={rootRef} className="mb-5 flex flex-wrap items-center gap-2">
      <p className="mr-2 text-[13px] text-[var(--fg-3)]">
        <span className="font-semibold tabular-nums text-[var(--fg)]">{totalCount.toLocaleString()}</span>{' '}
        {totalCount === 1 ? 'result' : 'results'}
      </p>

      {favoritePrompts.length > 0 && (
        <Dropdown
          icon={<Star className="h-3.5 w-3.5 fill-[var(--warn)] text-[var(--warn)]" />}
          label="Favorites"
          count={favoritePrompts.length}
          isOpen={openDropdown === 'favorites'}
          onToggle={() => toggle('favorites')}
        >
          <PromptPickerList
            prompts={favoritePrompts}
            onSelect={p => {
              onPromptSelect(p);
              setOpenDropdown(null);
            }}
          />
        </Dropdown>
      )}

      {recentlyViewedPrompts.length > 0 && (
        <Dropdown
          icon={<Clock className="h-3.5 w-3.5 text-[var(--fg-4)]" />}
          label="Recent"
          isOpen={openDropdown === 'recent'}
          onToggle={() => toggle('recent')}
        >
          <PromptPickerList
            prompts={recentlyViewedPrompts}
            onSelect={p => {
              onPromptSelect(p);
              setOpenDropdown(null);
            }}
          />
        </Dropdown>
      )}

      {allTags.length > 0 && (
        <Dropdown
          icon={<Tag className="h-3.5 w-3.5 text-[var(--fg-4)]" />}
          label="Tags"
          count={selectedTags.length}
          active={selectedTags.length > 0}
          isOpen={openDropdown === 'tags'}
          onToggle={() => toggle('tags')}
          width="w-[380px] max-w-[calc(100vw-2rem)]"
        >
          <div className="mb-2 flex items-center gap-2">
            <input
              type="text"
              value={tagQuery}
              onChange={e => setTagQuery(e.target.value)}
              placeholder={`Filter ${allTags.length} tags`}
              aria-label="Filter tags"
              className="input h-8 text-[12.5px]"
            />
            {selectedTags.length > 0 && (
              <button type="button" onClick={onClearTags} className="btn btn-ghost btn-sm shrink-0 text-[var(--danger)]">
                Clear
              </button>
            )}
          </div>
          <div className="flex max-h-72 flex-wrap gap-1.5 overflow-y-auto">
            {visibleTags.map(tag => (
              <Chip key={tag} active={selectedTags.includes(tag)} onClick={() => onTagToggle(tag)}>
                {tag}
              </Chip>
            ))}
            {visibleTags.length === 0 && <p className="px-1 py-3 text-[12.5px] text-[var(--fg-5)]">No tags match.</p>}
          </div>
        </Dropdown>
      )}

      {/* Active tag filters, inline */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {selectedTags.map(tag => (
            <Chip key={tag} active onClick={() => onTagToggle(tag)} aria-label={`Remove tag ${tag}`}>
              {tag}
              <X className="h-3 w-3" />
            </Chip>
          ))}
        </div>
      )}

      <div className="ml-auto">
        <Dropdown
          icon={<SortIcon className="h-3.5 w-3.5 text-[var(--fg-4)]" />}
          label={currentSort.label}
          isOpen={openDropdown === 'sort'}
          onToggle={() => toggle('sort')}
          align="right"
          width="w-48"
        >
          <div role="menu" className="space-y-0.5">
            {SORT_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const active = opt.id === sortOption;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    onSortChange(opt.id);
                    setOpenDropdown(null);
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-[var(--r-md)] px-2.5 py-2 text-left text-[13px] transition-colors',
                    active ? 'bg-[var(--tint)] text-[var(--fg)]' : 'text-[var(--fg-3)] hover:bg-[var(--surface-2)] hover:text-[var(--fg)]',
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5', active ? 'text-[var(--accent)]' : 'text-[var(--fg-4)]')} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
