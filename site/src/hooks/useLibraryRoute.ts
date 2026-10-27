/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { type Prompt } from '../components/PromptCard';
import { READ_ONLY } from '../lib/mode';

/** What the Skills section lists: single skills, or the repos (libraries) that ship several. */
export type SkillView = 'skills' | 'libraries';

const parseSkillView = (v: string | null): SkillView => (v === 'libraries' ? 'libraries' : 'skills');

export type LibraryTab = 'agent-guides' | 'agents' | 'prompt-library' | 'skills' | 'system-prompts' | 'mcp-servers' | 'skill-packs';

const TABS: readonly LibraryTab[] = ['agent-guides', 'agents', 'prompt-library', 'skills', 'system-prompts', 'mcp-servers', 'skill-packs'];

// The tab id doubles as the `?section=` value. Anything unrecognised lands on Prompts.
function parseSection(section: string | null): LibraryTab {
  return TABS.find(tab => tab === section) ?? 'prompt-library';
}

export function slugifyPromptPath(promptId: string): string {
  return promptId
    .replace(/\\/g, '/')
    .replace(/\.md$/i, '')
    .replace(/^library\//i, '')
    .split('/')
    .filter(Boolean)
    .join('/');
}

interface UseLibraryRouteOptions {
  selectedPrompt: Prompt | null;
  setSelectedPrompt: (prompt: Prompt | null) => void;
  setLibraryMode: (mode: 'public' | 'my') => void;
}

/**
 * The URL-backed navigation state: section tab, category, subcategory and the
 * `?prompt=` deep link. Seeded from the query string on load, written back with
 * `replaceState` whenever it changes, and re-read on back/forward.
 *
 * `libraryMode` and the selected prompt stay in App — they have their own
 * persistence and fetching — so the hook takes their setters for popstate.
 * Resolving a `?prompt=` path to a prompt also stays in App, since it needs the
 * loaded listing and `handlePromptClick`.
 */
export function useLibraryRoute({ selectedPrompt, setSelectedPrompt, setLibraryMode }: UseLibraryRouteOptions) {
  const [activeTab, setActiveTab] = useState<LibraryTab>(
    () => parseSection(new URLSearchParams(window.location.search).get('section')),
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get('category'),
  );
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get('subcategory'),
  );
  // Skills only: `?view=libraries`.
  const [skillView, setSkillView] = useState<SkillView>(
    () => parseSkillView(new URLSearchParams(window.location.search).get('view')),
  );
  const [promptPathParam, setPromptPathParam] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get('prompt'),
  );

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const library = urlParams.get('library');
      const prompt = urlParams.get('prompt');

      setActiveTab(parseSection(urlParams.get('section')));
      if (library === 'public' || (library === 'my' && !READ_ONLY)) setLibraryMode(library);
      setActiveCategory(urlParams.get('category'));
      setActiveSubcategory(urlParams.get('subcategory'));
      setSkillView(parseSkillView(urlParams.get('view')));
      setPromptPathParam(prompt);

      if (!prompt) {
        setSelectedPrompt(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLibraryMode, setSelectedPrompt]);

  // Update URL when navigation state changes
  useEffect(() => {
    const url = new URL(window.location.href);

    url.searchParams.set('section', activeTab);

    if (activeCategory) {
      url.searchParams.set('category', activeCategory);
    } else {
      url.searchParams.delete('category');
    }

    if (activeSubcategory) {
      url.searchParams.set('subcategory', activeSubcategory);
    } else {
      url.searchParams.delete('subcategory');
    }

    if (activeTab === 'skills' && skillView === 'libraries') url.searchParams.set('view', skillView);
    else url.searchParams.delete('view');

    if (selectedPrompt && !selectedPrompt.isUserOwned) {
      url.searchParams.set('prompt', slugifyPromptPath(selectedPrompt.id));
    } else {
      url.searchParams.delete('prompt');
    }

    window.history.replaceState({}, '', url.toString());
  }, [activeTab, activeCategory, activeSubcategory, skillView, selectedPrompt]);

  return {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    skillView,
    setSkillView,
    promptPathParam,
    setPromptPathParam,
  };
}
