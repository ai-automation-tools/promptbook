/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import {
  Terminal,
  Sparkles,
  Zap,
  Wrench,
  Bot,
  ChevronDown,
  Github,
  ExternalLink,
  FileText,
  Library,
  BookOpen,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { cn } from '../lib/cn';
import resources from '../../library/resources.json';

interface ResourceLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface ResourceGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  accent: string;
  links: ResourceLink[];
}

/**
 * External reading, grouped, one column per group. The data lives in
 * `library/resources.json` so the discovery script and the upkeep job can add
 * or drop a link without touching this component; icons are named there and
 * resolved here.
 */
const ICONS: Record<string, LucideIcon> = {
  terminal: Terminal,
  sparkles: Sparkles,
  zap: Zap,
  wrench: Wrench,
  bot: Bot,
  github: Github,
  'file-text': FileText,
  library: Library,
  'book-open': BookOpen,
  compass: Compass,
};

export const RESOURCE_GROUPS: ResourceGroup[] = resources.groups.map(g => ({
  ...g,
  icon: ICONS[g.icon] ?? Compass,
  links: g.links.map(l => ({ ...l, icon: ICONS[l.icon] ?? ExternalLink })),
}));

export default function ResourcesNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative hidden 2xl:block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn('btn btn-ghost btn-sm gap-1.5', open && 'bg-[color-mix(in_srgb,var(--fg)_7%,transparent)] text-[var(--fg)]')}
      >
        <Compass className="h-3.5 w-3.5" />
        Resources
        <ChevronDown className={cn('h-3 w-3 text-[var(--fg-4)] transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.7, 0.2, 1] }}
            className="popover absolute right-0 top-full z-[100] mt-2 w-[720px] p-2"
          >
            <div className="grid grid-cols-3 gap-1">
              {RESOURCE_GROUPS.map(group => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.id} className="p-2" style={{ ['--c' as string]: group.accent }}>
                    <div className="mb-1.5 flex items-center gap-2 px-2">
                      <span className="grid h-5 w-5 place-items-center rounded-[5px] bg-[color-mix(in_srgb,var(--c)_12%,transparent)] text-[var(--c)]">
                        <GroupIcon className="h-3 w-3" />
                      </span>
                      <span className="eyebrow text-[10px]">{group.label}</span>
                    </div>
                    <ul>
                      {group.links.map(link => {
                        const LinkIcon = link.icon;
                        return (
                          <li key={link.href + link.label}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              role="menuitem"
                              className="group flex items-center gap-2.5 rounded-[var(--r-md)] px-2 py-[6px] text-[13px] text-[var(--fg-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--fg)]"
                            >
                              <LinkIcon className="h-3.5 w-3.5 shrink-0 text-[var(--fg-5)] transition-colors group-hover:text-[var(--c)]" />
                              <span className="truncate">{link.label}</span>
                              <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-[var(--fg-5)] opacity-0 transition-opacity group-hover:opacity-100" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
