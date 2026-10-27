/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo, useState } from 'react';
import { BookOpen, ChevronDown, Layers, Library, Package, PanelLeftClose, Search, Star, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, m } from 'motion/react';
import { cn } from '../lib/cn';
import { categoryHue, getSection, humanize } from '../lib/sections';
import type { LibraryTab } from '../hooks/useLibraryRoute';
import type { Prompt } from './PromptCard';
import { SKILL_KINDS, isLibraryItem, type SkillKind } from './SkillLibraries';
import { READ_ONLY } from '../lib/mode';

export interface SkillPackSummary {
  id: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  tags: string[];
  category: string;
  skillCount: number;
  author: string;
  created_at: string;
  updated_at: string;
}

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  libraryMode: 'public' | 'my';
  setLibraryMode: (mode: 'public' | 'my') => void;
  activeTab: LibraryTab;
  skillPacks: SkillPackSummary[];
  categories: Record<string, Set<string>>;
  sectionPrompts: Prompt[];
  expandedCategories: Record<string, boolean>;
  setExpandedCategories: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  toggleCategory: (cat: string) => void;
  selectedSubcategory: { category: string; subcategory: string | 'ALL' } | null;
  handleSubcategoryClick: (category: string, subcategory: string | 'ALL') => void;
  handleShowAllPrompts: () => void;
  /** Starred prompts in the current section and library. */
  favoriteCount: number;
  showFavorites: boolean;
  onShowFavorites: () => void;
  /** Skills and Skill Packs: which of Skills | Libraries | Packs is showing. */
  skillKind?: SkillKind;
  onSkillKind?: (kind: SkillKind) => void;
  /** Libraries view: the library cards replace the category tree; a row opens one. */
  onOpenLibrary?: (library: Prompt) => void;
}

export const SIDEBAR_WIDTH = 272;

/**
 * The categories panel: the Public | My Library switch, then the category
 * tree for the current section, each category in its own hue. Sections live in
 * SectionRail, whose current tab joins onto this panel's section-tinted ground.
 * A drawer over the page on phones, a column beside it from md up.
 */
export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  libraryMode,
  setLibraryMode,
  activeTab,
  skillPacks,
  categories,
  sectionPrompts,
  expandedCategories,
  setExpandedCategories,
  toggleCategory,
  selectedSubcategory,
  handleSubcategoryClick,
  handleShowAllPrompts,
  favoriteCount,
  showFavorites,
  onShowFavorites,
  skillKind,
  onSkillKind,
  onOpenLibrary,
}: SidebarProps) {
  const [categoryFilter, setCategoryFilter] = useState('');

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of sectionPrompts) counts[p.category] = (counts[p.category] ?? 0) + 1;
    return counts;
  }, [sectionPrompts]);

  const packsByCategory = useMemo(() => {
    const map: Record<string, SkillPackSummary[]> = {};
    for (const pack of skillPacks) (map[pack.category] ??= []).push(pack);
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [skillPacks]);

  const categoryNames = useMemo(() => {
    const names = Object.keys(categories).sort();
    const q = categoryFilter.trim().toLowerCase();
    return q ? names.filter(n => n.toLowerCase().includes(q)) : names;
  }, [categories, categoryFilter]);

  // Under Libraries the tree would only repeat Skills, so the panel lists the libraries instead.
  const showLibraries = skillKind === 'libraries';
  const libraries = useMemo(() => {
    if (!showLibraries) return [];
    const q = categoryFilter.trim().toLowerCase();
    const all = sectionPrompts.filter(isLibraryItem).sort((a, b) => a.title.localeCompare(b.title));
    return q ? all.filter(l => l.title.toLowerCase().includes(q)) : all;
  }, [showLibraries, sectionPrompts, categoryFilter]);

  const showCategoryFilter = showLibraries || Object.keys(categories).length > 8;
  const section = getSection(activeTab);
  const SectionIcon = section.icon;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-full shrink-0 flex-col overflow-hidden',
        'border-r border-[var(--rule)] bg-[var(--side-bg)]',
        'transition-[transform,width] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
        'md:relative md:translate-x-0',
        'w-[min(272px,85vw)] md:w-[272px]',
        isSidebarOpen ? 'translate-x-0 shadow-[0_0_60px_-20px_var(--pop-shadow)] md:shadow-none' : '-translate-x-full md:w-0 md:border-r-0',
      )}
      aria-label="Categories"
    >
      <div className="flex h-full flex-col" style={{ width: SIDEBAR_WIDTH }}>
        {/* Panel head: lines up with the top bar's bottom rule. */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--bar-line)] px-4">
          <button
            type="button"
            onClick={handleShowAllPrompts}
            className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
            style={{ ['--c' as string]: section.accent }}
          >
            <span className="glyph h-8 w-8 rounded-[8px]">
              <SectionIcon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-semibold tracking-tight text-[var(--fg)]">{section.label}</span>
              <span className="eyebrow block text-[9.5px] tracking-[0.16em]">{libraryMode === 'my' ? 'My Library' : 'Public Library'}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="icon-btn"
            aria-label="Hide categories"
            title="Hide categories (click the section in the rail to bring them back)"
          >
            <X className="h-4 w-4 md:hidden" />
            <PanelLeftClose className="hidden h-4 w-4 md:block" />
          </button>
        </div>

        {/* Library switch — the read-only demo has no My Library to switch to */}
        {!READ_ONLY && (
        <div className="px-3 pt-3">
          <LayoutGroup id="library-mode">
            <div className="segmented w-full" role="group" aria-label="Library">
              {(
                [
                  { id: 'public', label: 'Public', icon: BookOpen },
                  { id: 'my', label: 'My Library', icon: Library },
                ] as const
              ).map(({ id, label, icon: Icon }) => {
                const active = libraryMode === id;
                return (
                  <button key={id} type="button" aria-pressed={active} onClick={() => setLibraryMode(id)}>
                    {active && (
                      <m.span
                        layoutId="library-mode-thumb"
                        className="segmented-thumb"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
        )}

        {/* Skills | Libraries | Packs */}
        {skillKind && onSkillKind && (
        <div className="px-3 pt-3">
          <LayoutGroup id="skill-kind">
            <div className="segmented w-full" role="group" aria-label="Skill kind">
              {SKILL_KINDS.map(({ id, label, icon: Icon }) => {
                const active = skillKind === id;
                return (
                  <button key={id} type="button" aria-pressed={active} onClick={() => onSkillKind(id)}>
                    {active && (
                      <m.span
                        layoutId="skill-kind-thumb"
                        className="segmented-thumb"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </div>
        )}

        {/* Categories */}
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-5 pb-1.5 pt-4">
            <p className="eyebrow">{activeTab === 'skill-packs' ? 'Pack categories' : showLibraries ? 'Libraries' : 'Categories'}</p>
            <span className="mono text-[10.5px] text-[var(--fg-5)]">
              {activeTab === 'skill-packs' ? packsByCategory.length : showLibraries ? libraries.length : Object.keys(categories).length}
            </span>
          </div>

          {showCategoryFilter && activeTab !== 'skill-packs' && (
            <div className="relative px-3 pb-2">
              <Search className="pointer-events-none absolute left-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--fg-4)]" />
              <input
                type="text"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                placeholder={showLibraries ? 'Filter libraries' : 'Filter categories'}
                aria-label={showLibraries ? 'Filter libraries' : 'Filter categories'}
                className="input h-8 pl-8 text-[12.5px]"
              />
            </div>
          )}

          <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-3 pb-3">
            {showLibraries ? (
              <>
                {libraries.map(lib => (
                  <button
                    key={lib.id}
                    type="button"
                    onClick={() => onOpenLibrary?.(lib)}
                    title={lib.title}
                    className="flex w-full items-center gap-2 rounded-[var(--r-md)] px-2 py-[6px] text-left text-[13px] text-[var(--fg-3)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--fg)]"
                  >
                    <Library className="h-3.5 w-3.5 shrink-0 text-[var(--fg-4)]" />
                    <span className="min-w-0 flex-1 truncate">{lib.title}</span>
                  </button>
                ))}
                {libraries.length === 0 && (
                  <p className="px-2 py-6 text-center text-[12.5px] text-[var(--fg-5)]">
                    {categoryFilter ? 'No libraries match.' : 'No libraries here.'}
                  </p>
                )}
              </>
            ) : (<>
            {/* Favorites: starred items, or starred packs on Skill Packs */}
            <button
              type="button"
              onClick={onShowFavorites}
              aria-current={showFavorites ? 'true' : undefined}
              className={cn(
                'group mb-1.5 flex w-full items-center gap-2 rounded-[var(--r-md)] px-2 py-[6px] text-left text-[13px] transition-colors',
                showFavorites
                  ? 'bg-[var(--surface)] text-[var(--fg)]'
                  : 'text-[var(--fg-3)] hover:bg-[var(--surface)] hover:text-[var(--fg)]',
              )}
            >
              <Star
                className={cn(
                  'h-3.5 w-3.5 shrink-0 transition-colors',
                  showFavorites || favoriteCount > 0 ? 'fill-[var(--warn)] text-[var(--warn)]' : 'text-[var(--fg-4)]',
                )}
              />
              <span className="flex-1 truncate font-medium">Favorites</span>
              <span className="mono text-[10.5px] tabular-nums text-[var(--fg-5)]">{favoriteCount}</span>
            </button>
            <hr className="mx-2 mb-1.5 border-t border-[var(--line)]" aria-hidden="true" />
            {activeTab === 'skill-packs'
              ? packsByCategory.map(([cat, packs]) => {
                  const expanded = !!expandedCategories[cat];
                  return (
                    <div key={cat}>
                      <CategoryRow
                        icon={Package}
                        label={humanize(cat)}
                        count={packs.length}
                        expanded={expanded}
                        onClick={() => setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }))}
                      />
                      <Collapse open={expanded}>
                        {packs
                          .slice()
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map(pack => (
                            <div
                              key={pack.id}
                              className="flex items-center gap-2 px-2.5 py-1.5 text-[12.5px] text-[var(--fg-4)]"
                            >
                              <span className="text-sm leading-none">{pack.icon}</span>
                              <span className="truncate">{pack.name}</span>
                            </div>
                          ))}
                      </Collapse>
                    </div>
                  );
                })
              : categoryNames.map(cat => {
                  const expanded = !!expandedCategories[cat];
                  const subcategories = Array.from(categories[cat] ?? []).sort();
                  return (
                    <div key={cat} className="hue" style={{ ['--hue' as string]: categoryHue(cat) }}>
                      <CategoryRow
                        label={humanize(cat)}
                        count={categoryCounts[cat] ?? 0}
                        expanded={expanded}
                        active={selectedSubcategory?.category === cat}
                        onClick={() => toggleCategory(cat)}
                      />
                      <Collapse open={expanded}>
                        <SubcategoryRow
                          icon={Layers}
                          label="All"
                          active={selectedSubcategory?.category === cat && selectedSubcategory.subcategory === 'ALL'}
                          onClick={() => handleSubcategoryClick(cat, 'ALL')}
                        />
                        {subcategories.map(sub => (
                          <SubcategoryRow
                            key={sub}
                            label={humanize(sub)}
                            active={selectedSubcategory?.category === cat && selectedSubcategory.subcategory === sub}
                            onClick={() => handleSubcategoryClick(cat, sub)}
                          />
                        ))}
                      </Collapse>
                    </div>
                  );
                })}
            {activeTab !== 'skill-packs' && categoryNames.length === 0 && (
              <p className="px-2 py-6 text-center text-[12.5px] text-[var(--fg-5)]">
                {categoryFilter ? 'No categories match.' : 'No categories yet.'}
              </p>
            )}
            </>)}
          </div>
        </div>
      </div>
    </aside>
  );
}

function CategoryRow({
  icon: Icon,
  label,
  count,
  expanded,
  active,
  onClick,
}: {
  /** Omitted: a dot in the row's --c (the category hue). */
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  count: number;
  expanded: boolean;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={expanded}
      className={cn(
        'group flex w-full items-center gap-2 rounded-[var(--r-md)] px-2 py-[6px] text-left text-[13px] transition-colors',
        expanded || active
          ? 'bg-[color-mix(in_srgb,var(--c)_14%,transparent)] text-[var(--fg)]'
          : 'text-[var(--fg-3)] hover:bg-[var(--surface)] hover:text-[var(--fg)]',
      )}
    >
      {Icon ? (
        <Icon
          className={cn(
            'h-3.5 w-3.5 shrink-0 transition-colors',
            expanded || active ? 'text-[var(--c)]' : 'text-[var(--fg-4)] group-hover:text-[var(--fg-3)]',
          )}
        />
      ) : (
        <span className="hue-dot" aria-hidden="true" />
      )}
      <span className="flex-1 truncate font-medium">{label}</span>
      <span className="mono text-[10.5px] tabular-nums text-[var(--fg-5)]">{count}</span>
      <ChevronDown
        className={cn(
          'h-3.5 w-3.5 shrink-0 text-[var(--fg-5)] transition-transform duration-300',
          !expanded && '-rotate-90',
        )}
      />
    </button>
  );
}

function SubcategoryRow({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'flex w-full items-center gap-2 rounded-[6px] px-2.5 py-[5px] text-left text-[12.5px] transition-colors',
        active
          ? 'bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[var(--fg)]'
          : 'text-[var(--fg-4)] hover:bg-[var(--surface)] hover:text-[var(--fg-2)]',
      )}
    >
      {Icon ? (
        <Icon className={cn('h-3 w-3 shrink-0', active ? 'text-[var(--c)]' : 'text-[var(--fg-5)]')} />
      ) : (
        <span
          className={cn('h-1.5 w-1.5 shrink-0 rounded-full', active ? 'bg-[var(--c)]' : 'bg-[var(--fg-5)]')}
          style={active ? { boxShadow: '0 0 8px var(--c)' } : undefined}
        />
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <m.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className="mb-1.5 ml-[15px] mt-0.5 space-y-0.5 border-l border-[var(--line)] pl-2">{children}</div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
