/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { Menu, PanelLeft, Plus, Search, Settings, X } from 'lucide-react';
import { NAV_SECTIONS, navTab } from '../lib/sections';
import type { LibraryTab } from '../hooks/useLibraryRoute';
import type { Theme } from '../hooks/useTheme';
import { READ_ONLY } from '../lib/mode';
import ResourcesNav, { RESOURCE_GROUPS } from './ResourcesNav';
import ThemeSwitch from './ThemeSwitch';
import { Button, IconButton, Kbd, MOD_KEY } from './ui/primitives';

interface TopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTab: LibraryTab;
  onSelectSection: (tab: LibraryTab) => void;
  onOpenPalette: () => void;
  onOpenSettings: () => void;
  onNewPrompt: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

/**
 * The house-style top bar: categories toggle (phones), then search (⌘K), Resources,
 * New item and the Light | Dark switch. From md the sections, brand and
 * Settings live in SectionRail; on phones the brand and Settings stay here and
 * the sections are a swipeable strip under the bar. Below 1536px the menu button
 * opens a sheet with the Resources links, whose dropdown only fits from 1536px.
 */
export default function TopBar({
  sidebarOpen,
  onToggleSidebar,
  activeTab,
  onSelectSection,
  onOpenPalette,
  onOpenSettings,
  onNewPrompt,
  theme,
  setTheme,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const stripRef = useRef<HTMLElement>(null);

  // Keep the current section's chip in view when it changes (deep link, palette, rail).
  useEffect(() => {
    stripRef.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeTab]);

  const pick = (tab: LibraryTab) => {
    onSelectSection(tab);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="topbar">
        {/* Phones only: from md the panel closes from its own head and reopens from the rail. */}
        <IconButton label={sidebarOpen ? 'Hide categories' : 'Show categories'} onClick={onToggleSidebar} aria-expanded={sidebarOpen} className="md:hidden">
          <PanelLeft className="h-4 w-4" />
        </IconButton>

        <button type="button" className="brand md:hidden" onClick={() => pick('prompt-library')} aria-label="Promptbook home">
          <img src="/favicon.svg" alt="" width={24} height={24} />
        </button>

        <div className="topbar-right">
          <button type="button" className="kbd-btn" onClick={onOpenPalette} aria-label="Search the library">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="mr-auto">Search the library…</span>
            <Kbd>{MOD_KEY}</Kbd>
            <Kbd>K</Kbd>
          </button>

          <IconButton label="Search the library" onClick={onOpenPalette} className="md:hidden">
            <Search className="h-4 w-4" />
          </IconButton>

          <ResourcesNav />

          {!READ_ONLY && (
            <Button variant="primary" size="sm" icon={<Plus className="h-3.5 w-3.5" />} onClick={onNewPrompt} className="hidden sm:inline-flex">
              New item
            </Button>
          )}

          <IconButton label="Settings" framed onClick={onOpenSettings} className="md:hidden">
            <Settings className="h-4 w-4" />
          </IconButton>

          <ThemeSwitch theme={theme} setTheme={setTheme} />

          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Phones only: the sections stay one tap away, where the rail would be on wider screens. */}
      <nav ref={stripRef} className="section-strip" aria-label="Sections">
        {NAV_SECTIONS.map(section => {
          const Icon = section.icon;
          const current = section.id === navTab(activeTab);
          return (
            <button
              key={section.id}
              type="button"
              aria-current={current ? 'page' : undefined}
              onClick={() => pick(section.id)}
              style={{ ['--c' as string]: section.accent }}
            >
              <Icon className="h-3.5 w-3.5 text-[var(--c)]" aria-hidden="true" />
              {section.short}
            </button>
          );
        })}
      </nav>

      <nav id="mobile-nav" className={menuOpen ? 'mobile-nav open' : 'mobile-nav'} aria-label="Resources">
        {RESOURCE_GROUPS.map(group => (
          <div key={group.id} style={{ ['--c' as string]: group.accent }}>
            <p className="mobile-nav-group eyebrow">{group.label}</p>
            {group.links.map(link => {
              const Icon = link.icon;
              return (
                <a key={link.href + link.label} href={link.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
                  <Icon className="h-4 w-4 text-[var(--c)]" aria-hidden="true" />
                  {link.label}
                </a>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}
