/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExternalLink, GitCompare, Github, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

/** Mirrors `ItemSource` in lib/library.ts (the API's `source` on a library item). */
export interface ItemSource {
  repo: string;
  url: string;
  ref?: string;
  compareUrl?: string;
  match?: string;
  verdict?: 'current' | 'drifted' | 'behind' | 'upstream-gone' | 'repo-gone' | 'error';
  checked?: string;
}

const BADGE: Record<string, { label: string; tone: string; hint: string }> = {
  current: { label: 'Up to date', tone: 'var(--ok)', hint: 'Identical to the upstream file at the last weekly check.' },
  drifted: { label: 'Minor upstream changes', tone: 'var(--warn)', hint: 'Upstream has edited this file a little since our copy.' },
  behind: { label: 'Behind upstream', tone: 'var(--warn)', hint: 'Upstream has changed a quarter or more of this file since our copy.' },
  'upstream-gone': { label: 'Removed upstream', tone: 'var(--danger)', hint: 'The repo no longer has this file.' },
  'repo-gone': { label: 'Repo gone', tone: 'var(--danger)', hint: 'The upstream repo no longer exists.' },
  fork: { label: 'Archived copy', tone: 'var(--fg-4)', hint: 'Upstream has since removed or replaced this file; this copy is kept as it was.' },
  vendor: { label: 'Vendor-published', tone: 'var(--ok)', hint: 'Published by the vendor on its own site.' },
};

/**
 * The repo link at the top of every item: where a skill, agent, system prompt or
 * prompt comes from, the server behind an MCP card, or the tool a guide documents.
 * Skills and agents also show the commit our copy was taken from, how it stood at
 * the last weekly drift check, and a link to everything upstream changed since.
 */
export default function SourcePanel({ source }: { source: ItemSource }) {
  const badge = source.match === 'fork' || source.match === 'vendor' ? BADGE[source.match] : source.verdict ? BADGE[source.verdict] : undefined;
  const Icon = source.match === 'vendor' ? Globe : Github;
  const link = 'inline-flex items-center gap-1.5 text-[12.5px] text-[var(--fg-3)] transition-colors hover:text-[var(--fg)]';

  return (
    <div className="relative mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--r-md)] border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-w-0 items-center gap-2 text-[13px] font-medium text-[var(--fg)] hover:text-[var(--c)]"
      >
        <Icon className="h-4 w-4 shrink-0 text-[var(--c)]" aria-hidden="true" />
        <span className="truncate">{source.repo}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--fg-4)]" aria-hidden="true" />
      </a>

      {badge && (
        <span
          title={badge.hint}
          className="inline-flex h-[22px] items-center gap-1.5 rounded-full border px-2 text-[11.5px] font-medium"
          style={{ color: badge.tone, borderColor: `color-mix(in srgb, ${badge.tone} 40%, transparent)` }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: badge.tone }} aria-hidden="true" />
          {badge.label}
        </span>
      )}

      {source.ref && (
        <span className="mono text-[11px] text-[var(--fg-4)]">
          copied at{' '}
          <a href={`https://github.com/${source.repo}/tree/${source.ref}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--fg)]">
            {source.ref.slice(0, 7)}
          </a>
          {source.checked && <> · checked {source.checked}</>}
        </span>
      )}

      {source.compareUrl && source.verdict !== 'current' && (
        <a href={source.compareUrl} target="_blank" rel="noopener noreferrer" className={cn(link, 'ml-auto')}>
          <GitCompare className="h-3.5 w-3.5" aria-hidden="true" />
          What changed upstream
        </a>
      )}
    </div>
  );
}
