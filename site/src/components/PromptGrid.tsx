/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import PromptCard, { type Prompt } from './PromptCard';
import EmptyState from './EmptyState';
import { usePromptPreviews } from '../hooks/usePromptPreviews';
import { Button } from './ui/primitives';

/**
 * The card-level props every prompt grid drills down to `PromptCard`. Bundled so
 * the three grids in the app (featured, all-prompts, subcategory) pass one object
 * instead of eleven props each.
 */
export interface PromptCardActions {
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId: string | null;
  favorites: string[];
  copied: string | null;
  onPromptClick: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onToggleFavorite: (promptId: string, e?: React.MouseEvent) => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  /** Takes the prompt, not its text: the card only holds a blurb. */
  onCopy: (prompt: Prompt) => void;
}

interface PromptCardGridProps {
  prompts: Prompt[];
  actions: PromptCardActions;
  /** Featured uses a 4-up grid at `lg`; the main lists step 2 → 3 → 4. */
  columns?: 'featured' | 'default';
}

const GRID_CLASS = {
  featured: 'grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4',
  default: 'grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4',
} as const;

/**
 * Responsive grid of `PromptCard`s — the markup shared by all three lists.
 *
 * Card blurbs are fetched here rather than passed in: every list renders through
 * this component, so one `usePromptPreviews` call covers featured, the paginated
 * list and the subcategory list without drilling a preview map through `actions`.
 */
export function PromptCardGrid({ prompts, actions, columns = 'default' }: PromptCardGridProps) {
  const promptsWithPreviews = usePromptPreviews(prompts);

  return (
    <div className={GRID_CLASS[columns]}>
      {promptsWithPreviews.map((prompt, i) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          index={i}
          // The card's own library, not the view's: Favorites mixes both
          libraryMode={prompt.isUserOwned ? 'my' : 'public'}
          copyingToMyPromptsId={actions.copyingToMyPromptsId}
          favorites={actions.favorites}
          copied={actions.copied}
          onPromptClick={actions.onPromptClick}
          onCopyToMyPrompts={actions.onCopyToMyPrompts}
          onToggleFavorite={actions.onToggleFavorite}
          onEditPrompt={actions.onEditPrompt}
          onDeletePrompt={actions.onDeletePrompt}
          onDownloadMarkdown={actions.onDownloadMarkdown}
          onCopy={actions.onCopy}
        />
      ))}
    </div>
  );
}

/** Eight shimmering card skeletons shown while the prompt list is in flight. */
export function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID_CLASS.default} aria-busy="true" aria-label="Loading prompts">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface flex flex-col gap-3 p-4" style={{ animationDelay: `${i * 60}ms` }}>
          <div className="flex items-center gap-3">
            <div className="skeleton h-9 w-9 rounded-[9px]" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-3 w-3/4" />
              <div className="skeleton h-2 w-1/2" />
            </div>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="skeleton h-2.5 w-full" />
            <div className="skeleton h-2.5 w-5/6" />
            <div className="skeleton h-2.5 w-3/5" />
          </div>
          <div className="flex gap-1.5 pt-1">
            <div className="skeleton h-5 w-12" />
            <div className="skeleton h-5 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function NoResults({ searchQuery }: { searchQuery: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="glyph mb-4 h-12 w-12 rounded-[12px]">
        <SearchX className="h-5 w-5" />
      </span>
      <h3 className="text-lg font-semibold text-[var(--fg)]">No prompts found</h3>
      <p className="mt-1.5 max-w-sm text-[14px] text-[var(--fg-3)]">
        {searchQuery ? (
          <>
            Nothing matches <span className="text-[var(--fg)]">“{searchQuery}”</span>. Try another term, or search the whole
            library with the command palette.
          </>
        ) : (
          'Nothing here yet — try another section.'
        )}
      </p>
    </div>
  );
}

interface PromptGridProps {
  isLoading: boolean;
  /** The current page's prompts. */
  prompts: Prompt[];
  /** Total matching the current filters, across all pages. */
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
  searchQuery: string;
  onBrowsePublic: () => void;
  actions: PromptCardActions;
}

/**
 * The main prompt list: loading skeletons, the empty states, the paginated card
 * grid, and its pagination controls. Purely presentational — search, sort and
 * page state all live in `usePromptFilters`.
 */
export default function PromptGrid({
  isLoading,
  prompts,
  totalCount,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage,
  searchQuery,
  onBrowsePublic,
  actions,
}: PromptGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (totalCount === 0) {
    if (actions.libraryMode === 'my') {
      return <EmptyState onBrowsePublic={onBrowsePublic} />;
    }
    return <NoResults searchQuery={searchQuery} />;
  }

  return (
    <>
      <PromptCardGrid prompts={prompts} actions={actions} />

      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
          <Button variant="outline" size="sm" onClick={onPreviousPage} disabled={currentPage === 1} icon={<ChevronLeft className="h-3.5 w-3.5" />}>
            Previous
          </Button>
          <span className="mono text-[12px] text-[var(--fg-4)]">
            Page <span className="text-[var(--fg)]">{currentPage}</span> of {totalPages}
            <span className="hidden sm:inline"> · {totalCount.toLocaleString()} total</span>
          </span>
          <Button variant="outline" size="sm" onClick={onNextPage} disabled={currentPage === totalPages}>
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </nav>
      )}
    </>
  );
}
