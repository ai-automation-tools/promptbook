/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { type Prompt } from '../components/PromptCard';
import { READ_ONLY } from '../lib/mode';
import { tellShell } from '../lib/embed';

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
  libraryMode: 'public' | 'my';
  setLibraryMode: (mode: 'public' | 'my') => void;
}

/**
 * The URL is the navigation state (PB-09): library, section, category, subcategory,
 * Skills' `?view=libraries`, `?favorites=1`, the open Skill Pack's `?pack=` and the `?prompt=` deep link. Seeded from the
 * query string on load and re-read on Back/Forward, so every screen has a link that restores
 * it. A change of view pushes a history entry; the first write (filling in defaults) and any
 * write after `replaceNextUrl()` replace the current one instead, so resolving a deep link
 * or leaving a view the library can't show doesn't leave a dead entry behind.
 *
 * The selected prompt and the listing stay in App, which resolves `?prompt=` once the
 * listing has loaded (and after Back/Forward lands on a prompt), so the hook takes their setters.
 */
export function useLibraryRoute({ selectedPrompt, setSelectedPrompt, libraryMode, setLibraryMode }: UseLibraryRouteOptions) {
  const initial = new URLSearchParams(window.location.search);
  const [activeTab, setActiveTab] = useState<LibraryTab>(() => parseSection(initial.get('section')));
  const [activeCategory, setActiveCategory] = useState<string | null>(() => initial.get('category'));
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(() => initial.get('subcategory'));
  // Skills only: `?view=libraries`.
  const [skillView, setSkillView] = useState<SkillView>(() => parseSkillView(initial.get('view')));
  // My Library only: the sidebar's Favorites view.
  const [showFavorites, setShowFavorites] = useState(() => initial.get('favorites') === '1');
  // Skill Packs only: the open pack.
  const [activePack, setActivePack] = useState<string | null>(() => initial.get('pack'));
  // A `?prompt=` not yet resolved to a prompt (on load, or after Back/Forward).
  const [promptPathParam, setPromptPathParam] = useState<string | null>(() => initial.get('prompt'));

  const selectedRef = useRef(selectedPrompt);
  selectedRef.current = selectedPrompt;
  const replaceNext = useRef(true); // the first write fills in defaults; it is not a navigation
  const replaceNextUrl = useCallback(() => { replaceNext.current = true; }, []);

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
      setShowFavorites(urlParams.get('favorites') === '1');
      setActivePack(urlParams.get('pack'));
      // Landing on another prompt: drop the open one so App resolves this one.
      const open = selectedRef.current;
      if (!prompt || !open || slugifyPromptPath(open.id) !== prompt) {
        setSelectedPrompt(null);
        setPromptPathParam(prompt);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setLibraryMode, setSelectedPrompt]);

  // State → URL. Equal URLs (Back/Forward, which set state from the URL) write nothing.
  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (key: string, value: string | null) => (value ? url.searchParams.set(key, value) : url.searchParams.delete(key));

    set('library', READ_ONLY ? null : libraryMode);
    set('section', activeTab);
    set('category', activeCategory);
    set('subcategory', activeSubcategory);
    set('view', activeTab === 'skills' && skillView === 'libraries' ? skillView : null);
    set('favorites', showFavorites && libraryMode === 'my' ? '1' : null);
    set('pack', activeTab === 'skill-packs' ? activePack : null);
    set('prompt', selectedPrompt ? slugifyPromptPath(selectedPrompt.id) : promptPathParam);

    const next = url.pathname + url.search + url.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      if (replaceNext.current) window.history.replaceState({}, '', next);
      else window.history.pushState({}, '', next);
    }
    replaceNext.current = false;
    tellShell({ type: 'route', path: url.pathname + url.search });
  }, [libraryMode, activeTab, activeCategory, activeSubcategory, skillView, showFavorites, activePack, selectedPrompt, promptPathParam]);

  return {
    activeTab,
    setActiveTab,
    activeCategory,
    setActiveCategory,
    activeSubcategory,
    setActiveSubcategory,
    skillView,
    setSkillView,
    showFavorites,
    setShowFavorites,
    activePack,
    setActivePack,
    promptPathParam,
    setPromptPathParam,
    replaceNextUrl,
  };
}
