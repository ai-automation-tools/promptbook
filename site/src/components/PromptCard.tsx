/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo, useCallback, type MouseEvent as ReactMouseEvent } from 'react';
import { Check, Copy, Download, FileText, FolderPlus, Pencil, Star, Trash2 } from 'lucide-react';
import { m } from 'motion/react';
import { cn } from '../lib/cn';
import { categoryHue, humanize } from '../lib/sections';
import { IconButton } from './ui/primitives';
import type { ItemSource } from './SourcePanel';
import { READ_ONLY } from '../lib/mode';
import { isStale, STALE_DAYS } from '../lib/freshness';

export interface Prompt {
  id: string;
  title: string;
  section: string;
  category: string;
  subcategory: string | null;
  tags: string[];
  content: string;
  lastModified: string;
  /** Library items: when last checked against the source repo, YYYY-MM-DD, from the index. */
  checked?: string;
  featured?: boolean;
  isUserOwned?: boolean;
  anchor?: string;
  sourceUrl?: string;
  /** Library items from `GET /api/prompts/:id` only: the GitHub repo it is copied from and how it stands. */
  source?: ItemSource;
  /** My Library copies only: how this copy stands against the public item it came from. */
  upstream?: { source: string; updateAvailable: boolean; localEdits: boolean } | null;
  /** From `GET /api/prompts/:id` only: frontmatter beyond the fields above (a skill's name, description…). */
  extra?: Record<string, unknown>;
  /** My Library only: the file's version, sent back on save so a stale edit is refused (409). */
  version?: string;
}

export function extractEmoji(text: string): { emoji: string | null; title: string } {
  const emojiRegex = /^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u;
  const match = text.match(emojiRegex);

  if (match) {
    return {
      emoji: match[1],
      title: text.slice(match[1].length).trim(),
    };
  }

  return {
    emoji: null,
    title: text,
  };
}

interface PromptCardProps {
  prompt: Prompt;
  index: number;
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId?: string | null;
  favorites?: string[];
  copied?: string | null;
  onPromptClick: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onToggleFavorite?: (promptId: string, e?: React.MouseEvent) => void;
  onEditPrompt?: (prompt: Prompt) => void;
  onDeletePrompt?: (promptId: string) => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  onCopy: (prompt: Prompt) => void;
}

/**
 * Plain-text blurb from a markdown body: headings, fence markers, emphasis, links
 * and list markers dropped, whitespace collapsed. Code inside fences is kept — many
 * prompts are nothing but a fenced block, and dropping it leaves no blurb at all. The listing preview is 200 chars
 * of raw markdown, which read as "## Purpose ```" on the card.
 */
export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/```[^\n]*/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+.*$/gm, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    // An image inside a link (a badge) leaves `[](url)` once the image is gone
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // The preview is cut at 200 characters, often mid-link: drop the open `[text](url`
    .replace(/!?\[[^\]\n]*(?:\]\([^)\n]*)?$/, '')
    .replace(/^\s*(?:[-*+]|\d+[.)])\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_~`]+/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Writes the cursor position into the card's --mx/--my for the spotlight ring. */
function trackSpotlight(e: ReactMouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
}

const PromptCard = memo(function PromptCard({
  prompt,
  index,
  libraryMode,
  copyingToMyPromptsId,
  favorites = [],
  copied,
  onPromptClick,
  onCopyToMyPrompts,
  onToggleFavorite,
  onEditPrompt,
  onDeletePrompt,
  onDownloadMarkdown,
  onCopy,
}: PromptCardProps) {
  const isFavorite = favorites.includes(prompt.id);
  const { emoji, title } = extractEmoji(prompt.title);
  // A preview cut off inside a code block strips to nothing; fall back to the raw text.
  const blurb = prompt.content ? (stripMarkdown(prompt.content) || prompt.content.replace(/\s+/g, ' ').trim()).slice(0, 170) : '';

  const stop = useCallback((fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  }, []);

  const open = () => onPromptClick(prompt);

  return (
    <m.article
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.025, 0.4), ease: [0.2, 0.7, 0.2, 1] }}
      className="spot hue group flex cursor-pointer flex-col"
      style={{ ['--hue' as string]: categoryHue(prompt.category) }}
      onMouseMove={trackSpotlight}
      onClick={open}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open ${title}`}
    >
      <span className="card-band" aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-4 pb-3.5">
        <div className="flex items-start gap-3">
          <span className="glyph">
            {emoji ? <span className="text-[17px] leading-none">{emoji}</span> : <FileText className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-[-0.01em] text-[var(--fg)] transition-colors group-hover:text-[color-mix(in_srgb,var(--c)_70%,var(--fg))]">
              {title}
            </h3>
            <p className="mono mt-1 truncate text-[10.5px] uppercase tracking-[0.1em] text-[var(--fg-4)]">
              <span className="text-[color-mix(in_srgb,var(--c)_var(--tint-k),var(--mix-ink))]">{humanize(prompt.category)}</span>
              {prompt.subcategory && <span> / {humanize(prompt.subcategory)}</span>}
            </p>
          </div>
          {isStale(prompt.checked) && (
            <span
              className="chip h-[20px] shrink-0 border-[color-mix(in_srgb,var(--warn)_40%,transparent)] text-[var(--warn)]"
              title={`Not checked against its source in over ${STALE_DAYS} days (last ${prompt.checked})`}
            >
              stale
            </span>
          )}
          {isFavorite && <Star className="h-3.5 w-3.5 shrink-0 fill-[var(--warn)] text-[var(--warn)]" aria-label="Favorite" />}
        </div>

        {blurb ? (
          <p className="line-clamp-3 text-[13px] leading-relaxed text-[var(--fg-3)]">{blurb}</p>
        ) : (
          <div className="space-y-1.5" aria-hidden="true">
            <div className="skeleton h-2.5 w-full" />
            <div className="skeleton h-2.5 w-5/6" />
            <div className="skeleton h-2.5 w-3/5" />
          </div>
        )}

        {prompt.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {prompt.tags.slice(0, 3).map(tag => (
              <span key={tag} className="chip h-[22px]">
                {tag}
              </span>
            ))}
            {prompt.tags.length > 3 && <span className="chip h-[22px] border-dashed">+{prompt.tags.length - 3}</span>}
          </div>
        )}
      </div>

      {/* Action row: revealed on hover / focus, always on touch. */}
      <div
        className={cn(
          'flex items-center gap-1 border-t border-[var(--line)] px-2.5 py-2',
          'translate-y-0 opacity-100 transition-all duration-300 md:translate-y-1 md:opacity-0',
          'md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100',
          // Touch tablets are md+ but can't hover, so keep the actions visible there too.
          '[@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100',
        )}
      >
        {/* A library item shows when it was last checked against its source; the file's mtime is
            only when this checkout wrote it. */}
        <span
          className="mono mr-auto pl-1 text-[10.5px] text-[var(--fg-5)]"
          title={prompt.checked ? 'Last checked against its source repo' : undefined}
        >
          {prompt.checked && 'checked '}
          {new Date(prompt.checked ?? prompt.lastModified).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', ...(prompt.checked && { timeZone: 'UTC' }) })}
        </span>
        {/* Favorites are one set in the browser, so every card has the star, read-only demo included */}
        {onToggleFavorite && (
          <IconButton
            label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={e => onToggleFavorite(prompt.id, e)}
            className={cn('h-7 w-7', isFavorite && 'text-[var(--warn)]')}
          >
            <Star className={cn('h-3.5 w-3.5', isFavorite && 'fill-current')} />
          </IconButton>
        )}
        {READ_ONLY ? null : libraryMode === 'public' ? (
          <IconButton
            label={copyingToMyPromptsId === prompt.id ? 'Saving…' : 'Save to My Library'}
            onClick={stop(() => onCopyToMyPrompts(prompt))}
            disabled={copyingToMyPromptsId === prompt.id}
            className={cn('h-7 w-7', copyingToMyPromptsId === prompt.id && 'text-[var(--accent)]')}
          >
            <FolderPlus className={cn('h-3.5 w-3.5', copyingToMyPromptsId === prompt.id && 'animate-pulse')} />
          </IconButton>
        ) : (
          <>
            {onEditPrompt && (
              <IconButton label="Edit prompt" onClick={stop(() => onEditPrompt(prompt))} className="h-7 w-7">
                <Pencil className="h-3.5 w-3.5" />
              </IconButton>
            )}
            {onDeletePrompt && (
              <IconButton
                label="Remove from My Library"
                onClick={stop(() => onDeletePrompt(prompt.id))}
                className="h-7 w-7 hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] hover:text-[var(--danger)]"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </IconButton>
            )}
          </>
        )}
        <IconButton label="Download as Markdown" onClick={stop(() => onDownloadMarkdown(prompt))} className="h-7 w-7">
          <Download className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton
          label={copied === prompt.id ? 'Copied' : 'Copy content'}
          onClick={stop(() => onCopy(prompt))}
          className={cn('h-7 w-7', copied === prompt.id && 'text-[var(--ok)]')}
        >
          {copied === prompt.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </IconButton>
      </div>
    </m.article>
  );
});

export default PromptCard;
