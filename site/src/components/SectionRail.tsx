/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Settings } from 'lucide-react';
import { SECTIONS } from '../lib/sections';
import type { LibraryTab } from '../hooks/useLibraryRoute';

interface SectionRailProps {
  activeTab: LibraryTab;
  /** Called with the current tab too: App uses that to show or hide the categories panel. */
  onSelectSection: (tab: LibraryTab) => void;
  onHome: () => void;
  onOpenSettings: () => void;
  /** Categories panel open: the current section's tab joins onto it. */
  joined: boolean;
}

/**
 * The always-visible section rail (md up): logo, the seven sections as hue
 * tiles, Settings at the foot. The current section's cell takes the categories
 * panel's colour and runs through the rail's edge into it, so the two read as
 * one tab; clicking that cell again hides or shows the panel. Phones get the
 * sections as a strip under the top bar instead.
 */
export default function SectionRail({ activeTab, onSelectSection, onHome, onOpenSettings, joined }: SectionRailProps) {
  return (
    <nav className="rail" data-joined={joined || undefined} aria-label="Sections">
      <button type="button" className="rail-logo" onClick={onHome} aria-label="Promptbook home">
        <img src="/favicon.svg" alt="" width={36} height={36} />
      </button>

      {SECTIONS.map(section => {
        const Icon = section.icon;
        const current = section.id === activeTab;
        return (
          <button
            key={section.id}
            type="button"
            className="rail-btn"
            aria-current={current ? 'true' : undefined}
            aria-expanded={current ? joined : undefined}
            title={current ? (joined ? 'Hide categories' : 'Show categories') : section.label}
            onClick={() => onSelectSection(section.id)}
            style={{ ['--c' as string]: section.accent }}
          >
            <span className="ic">
              <Icon aria-hidden="true" />
            </span>
            {section.short}
          </button>
        );
      })}

      <span className="flex-1" />

      <button type="button" className="rail-btn" onClick={onOpenSettings} aria-label="Settings">
        <span className="ic ic-plain">
          <Settings aria-hidden="true" />
        </span>
      </button>
    </nav>
  );
}
