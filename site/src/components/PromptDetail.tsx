/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FolderOpen,
  FolderPlus,
  Github,
  Globe,
  Hash,
  Layers,
  LayoutGrid,
  Library,
  Link2,
  Mail,
  Pencil,
  RefreshCw,
  Tag,
  Trash2,
} from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { m } from 'motion/react';
import SourcePanel from './SourcePanel';
import { cn } from '../lib/cn';
import { humanize } from '../lib/sections';
import type { Prompt } from './PromptCard';
import { extractEmoji } from './PromptCard';
import { Button, IconButton } from './ui/primitives';
import { READ_ONLY } from '../lib/mode';

interface PromptDetailProps {
  prompt: Prompt;
  libraryMode: 'public' | 'my';
  copyingToMyPromptsId?: string | null;
  copiedShareLink?: boolean;
  copied?: string | null;
  onBack: () => void;
  onDownloadMarkdown: (prompt: Prompt) => void;
  onCopyShareLink: (prompt: Prompt) => void;
  onCopyToMyPrompts: (prompt: Prompt) => void;
  onDeletePrompt: (promptId: string) => void;
  onEditPrompt: (prompt: Prompt) => void;
  onPullUpstream: (prompt: Prompt) => void;
  onCopy: (content: string, promptId: string) => void;
  onSubcategoryClick: (category: string, subcategory: string | 'ALL') => void;
  onShowAllPrompts: () => void;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function PromptDetail({
  prompt,
  libraryMode,
  copyingToMyPromptsId,
  copiedShareLink,
  copied,
  onBack,
  onDownloadMarkdown,
  onCopyShareLink,
  onCopyToMyPrompts,
  onDeletePrompt,
  onEditPrompt,
  onPullUpstream,
  onCopy,
  onSubcategoryClick,
  onShowAllPrompts,
}: PromptDetailProps) {
  const { emoji, title } = extractEmoji(prompt.title);
  const words = useMemo(() => wordCount(prompt.content), [prompt.content]);
  const isCopied = copied === prompt.id;
  const saving = copyingToMyPromptsId === prompt.id;

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Prompt: ${prompt.title}`);
    const body = encodeURIComponent(
      `---\ntitle: ${prompt.title}\ncategory: ${prompt.category}\ntags: ${prompt.tags.join(', ')}\n---\n\n${prompt.content}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <m.div
      key={`prompt-${prompt.id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      className="w-full pt-5"
    >
      {/* Title bar */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <IconButton label="Back" framed onClick={onBack} className="mt-0.5 h-9 w-9 shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </IconButton>
          <div className="min-w-0">
            <p className="eyebrow mb-1.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--c)]" style={{ boxShadow: '0 0 8px var(--c)' }} />
              {prompt.isUserOwned ? 'My Library' : humanize(prompt.section.replace(/^\d+_/, ''))}
            </p>
            <h1 className="flex items-start gap-2.5 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--fg)] md:text-[1.85rem]">
              {emoji && <span className="mt-0.5 text-[1.4rem] leading-none md:text-[1.6rem]">{emoji}</span>}
              <span>{title}</span>
            </h1>
            <p className="mono mt-1.5 truncate text-[11px] text-[var(--fg-5)]">{prompt.id}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
          <Button
            variant={isCopied ? 'tonal' : 'primary'}
            size="sm"
            onClick={() => onCopy(prompt.content, prompt.id)}
            icon={isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            style={isCopied ? ({ ['--c' as string]: 'var(--ok)' } as React.CSSProperties) : undefined}
          >
            {isCopied ? 'Copied' : 'Copy prompt'}
          </Button>
          {libraryMode === 'public' && !READ_ONLY && (
            <Button size="sm" onClick={() => onCopyToMyPrompts(prompt)} disabled={saving} icon={<FolderPlus className="h-3.5 w-3.5" />}>
              {saving ? 'Saving…' : 'Save to My Library'}
            </Button>
          )}
          <Button size="sm" onClick={() => onDownloadMarkdown(prompt)} icon={<Download className="h-3.5 w-3.5" />}>
            Download
          </Button>
          <IconButton
            label={copiedShareLink ? 'Link copied' : 'Copy direct link'}
            framed
            onClick={() => onCopyShareLink(prompt)}
            className={cn('h-[30px] w-[30px]', copiedShareLink && 'text-[var(--ok)]')}
          >
            {copiedShareLink ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
          </IconButton>
          <IconButton label="Share by email" framed onClick={shareByEmail} className="h-[30px] w-[30px]">
            <Mail className="h-3.5 w-3.5" />
          </IconButton>
          {libraryMode === 'my' && !READ_ONLY && (
            <IconButton label="Edit prompt" framed onClick={() => onEditPrompt(prompt)} className="h-[30px] w-[30px]">
              <Pencil className="h-3.5 w-3.5" />
            </IconButton>
          )}
          {libraryMode === 'my' && (
            <IconButton
              label="Remove from My Library"
              framed
              onClick={() => onDeletePrompt(prompt.id)}
              className="h-[30px] w-[30px] hover:border-[color-mix(in_srgb,var(--danger)_50%,transparent)] hover:bg-[color-mix(in_srgb,var(--danger)_12%,transparent)] hover:text-[var(--danger)]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </IconButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Content */}
        <article className="surface relative overflow-hidden p-6 md:p-8 lg:col-span-8 xl:col-span-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
            style={{ background: 'color-mix(in srgb, var(--c) 10%, transparent)' }}
          />
          {prompt.upstream?.updateAvailable && !READ_ONLY && (
            <div className="relative mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[var(--r-md)] border border-[color-mix(in_srgb,var(--warn)_45%,var(--line))] bg-[color-mix(in_srgb,var(--warn)_8%,transparent)] px-3 py-2 text-[13px] text-[var(--fg)]">
              <span>
                The Public Library version has changed{prompt.upstream.localEdits && ' — updating replaces your edits'}.
              </span>
              <Button size="sm" onClick={() => onPullUpstream(prompt)} icon={<RefreshCw className="h-3.5 w-3.5" />}>
                Update from public
              </Button>
            </div>
          )}
          {prompt.source ? (
            <SourcePanel source={prompt.source} />
          ) : prompt.sourceUrl && (
            <a
              href={prompt.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mb-5 inline-flex max-w-full items-center gap-2 rounded-[var(--r-md)] border border-[var(--line)] px-3 py-2 text-[13px] font-medium text-[var(--fg)] transition-colors hover:border-[color-mix(in_srgb,var(--c)_45%,var(--line))] hover:bg-[color-mix(in_srgb,var(--c)_8%,transparent)]"
            >
              {/^https:\/\/github\.com\//.test(prompt.sourceUrl)
                ? <Github className="h-4 w-4 shrink-0 text-[var(--c)]" aria-hidden="true" />
                : <Globe className="h-4 w-4 shrink-0 text-[var(--c)]" aria-hidden="true" />}
              <span className="truncate">{prompt.sourceUrl.replace(/^https?:\/\/(www\.)?(github\.com\/)?/, '')}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--fg-4)]" aria-hidden="true" />
            </a>
          )}
          {prompt.tags.length > 0 && (
            <div className="relative mb-6 flex flex-wrap gap-1.5">
              {prompt.tags.map(tag => (
                <span key={tag} className="chip">
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="markdown-body relative">
            <Markdown remarkPlugins={[remarkGfm]}>{prompt.content}</Markdown>
          </div>
        </article>

        {/* Metadata rail */}
        <aside className="space-y-4 lg:col-span-4 xl:col-span-3">
          <div className="surface p-5">
            <p className="eyebrow mb-3">Details</p>
            <dl className="divide-y divide-[var(--line)]">
              {[
                { label: 'Category', value: humanize(prompt.category), icon: FolderOpen },
                { label: 'Subcategory', value: prompt.subcategory ? humanize(prompt.subcategory) : '—', icon: Layers },
                {
                  label: 'Modified',
                  value: new Date(prompt.lastModified).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }),
                  icon: Clock,
                },
                { label: 'Length', value: `${words.toLocaleString()} words`, icon: Hash },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                  <dt className="flex items-center gap-2 text-[12.5px] text-[var(--fg-4)]">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </dt>
                  <dd className="min-w-0 text-right text-[13px] font-medium leading-snug text-[var(--fg)] [overflow-wrap:anywhere]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="surface p-5">
            <p className="eyebrow mb-3">Go to</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onSubcategoryClick(prompt.category, prompt.subcategory ?? 'ALL')}
                className="group flex flex-col items-center gap-2 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--c)_45%,var(--line))] hover:bg-[color-mix(in_srgb,var(--c)_8%,transparent)]"
              >
                <LayoutGrid className="h-4 w-4 text-[var(--fg-4)] transition-colors group-hover:text-[var(--c)]" />
                <span className="eyebrow text-[10px] text-[var(--fg-3)]">Related</span>
              </button>
              <button
                type="button"
                onClick={onShowAllPrompts}
                className="group flex flex-col items-center gap-2 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--c)_45%,var(--line))] hover:bg-[color-mix(in_srgb,var(--c)_8%,transparent)]"
              >
                <Library className="h-4 w-4 text-[var(--fg-4)] transition-colors group-hover:text-[var(--c)]" />
                <span className="eyebrow text-[10px] text-[var(--fg-3)]">Library</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </m.div>
  );
}
