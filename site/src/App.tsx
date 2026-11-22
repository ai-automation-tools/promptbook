/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, useRef, lazy, Suspense, type ComponentType, type UIEvent } from 'react';
import { ArrowLeft, Check, LayoutGrid, Link2, Plus, Sparkles } from 'lucide-react';
import SourceBar from './components/SourceBar';
import { EMBED, onShellTheme, tellShell } from './lib/embed';
import { LazyMotion, MotionConfig, m, AnimatePresence } from 'motion/react';
import { ToastContainer, type ToastProps } from './components/Toast';
import { type Prompt } from './components/PromptCard';
import type { PromptDraft } from './components/PromptEditorModal';
import Sidebar, { type SkillPackSummary } from './components/Sidebar';
import TopBar from './components/TopBar';
import SectionRail from './components/SectionRail';
import Breadcrumbs, { type Crumb } from './components/Breadcrumbs';
import LibraryHero from './components/LibraryHero';
import PromptGrid, { PromptCardGrid, type PromptCardActions } from './components/PromptGrid';
import PromptListToolbar from './components/PromptListToolbar';
import { SkillKindSwitch, SkillLibrariesView, isLibraryItem, type SkillKind } from './components/SkillLibraries';
import { Button } from './components/ui/primitives';
import { usePromptFilters } from './hooks/usePromptFilters';
import { fetchFullPrompt, usePromptContent } from './hooks/usePromptContent';
import { useFavorites } from './hooks/useFavorites';
import { toMarkdownFile } from './lib/markdown-file';
import { useLibraryRoute, slugifyPromptPath, type LibraryTab } from './hooks/useLibraryRoute';
import { usePalette, useTheme } from './hooks/useTheme';
import { categoryHue, getSection, getSectionFolder, getSectionDisplayName, getTabForFolder, humanize, lowerLabel } from './lib/sections';
import { READ_ONLY } from './lib/mode';
import { cn } from './lib/cn';

// Split out of the entry chunk: none of these render on first paint, and
// PromptDetail/PromptEditorModal each pull in react-markdown + remark-gfm.
// The modals and the palette are only mounted while open, so opening one is
// what fetches its chunk — mounting them closed would defeat the split.
// A chunk that fails to load (stale Vite dep cache in dev, a new deploy in prod)
// would unmount the whole tree and leave a black screen; reload once instead.
// If it fails again (dev server still stale), ErrorBoundary in main.tsx says to restart.
function lazyReload<P extends object>(load: () => Promise<{ default: ComponentType<P> }>) {
  return lazy(() => load().then((mod) => {
    try { sessionStorage.removeItem('chunk-reload'); } catch { /* storage blocked */ }
    return mod;
  }, (err) => {
    let reloaded = false;
    try { reloaded = sessionStorage.getItem('chunk-reload') === '1'; sessionStorage.setItem('chunk-reload', '1'); } catch { /* storage blocked */ }
    if (reloaded) throw err;
    location.reload();
    return new Promise<never>(() => {});
  }));
}

const SkillPacksView = lazyReload(() => import('./components/SkillPacksView'));
const PromptDetail = lazyReload(() => import('./components/PromptDetail'));
const PromptEditorModal = lazyReload(() => import('./components/PromptEditorModal'));
const CommandPalette = lazyReload(() => import('./components/CommandPalette'));
const SettingsModal = lazyReload(() => import('./components/SettingsModal'));

const chunkSpinner = (
  <div className="flex h-64 items-center justify-center">
    <div className="spinner" />
  </div>
);

const loadMotionFeatures = () => import('./lib/motion-features').then(mod => mod.default);

const PUBLIC_SHARE_ORIGIN = 'https://promptbook-demo.ai-automation-tools.dev';

/** localStorage throws when the browser blocks it (privacy modes, sandboxed frames); the app
    must still render, so a blocked read is "nothing saved" and a blocked write is skipped. */
function readStorage(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeStorage(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage blocked: not saved */ }
}

/** One library's listing (metadata only), or an error for a failed or malformed answer. */
async function fetchListing(mode: 'public' | 'my'): Promise<Prompt[]> {
  const res = await fetch(`/api/prompts?library=${mode}&lightweight=true`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !Array.isArray(data)) throw new Error(data?.error || `HTTP ${res.status}`);
  return data;
}

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [theme, setTheme] = useTheme();
  // Inside the suite shell (?embed=1 in a frame): announce ourselves and take its theme.
  useEffect(() => {
    tellShell({ type: 'ready', app: 'promptbook' });
    return onShellTheme(setTheme);
  }, [setTheme]);
  const [palette, setPalette] = usePalette();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  // Open on desktop, closed (a drawer) on phones.
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [copyingToMyPromptsId, setCopyingToMyPromptsId] = useState<string | null>(null);
  const [skillPacks, setSkillPacks] = useState<SkillPackSummary[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  
  // Library mode: 'public' or 'my'. The read-only demo has only 'public'.
  const [libraryMode, setLibraryMode] = useState<'public' | 'my'>(() => {
    if (READ_ONLY) return 'public';
    const saved = readStorage('library-mode');
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('library');
    if (urlMode === 'public' || urlMode === 'my') return urlMode;
    return (saved === 'public' || saved === 'my') ? saved as 'public' | 'my' : 'public';
  });
  
  // Navigation & Organization
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(readStorage('prompt-recently-viewed') || '[]');
      return Array.isArray(saved) ? saved.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  
  // Toast notifications
  const [toasts, setToasts] = useState<ToastProps[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  const showToast = useCallback((type: ToastProps['type'], message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, type, message, onClose: () => {} }]);
  }, []);

  const closeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Copy-button state plus the "go get the real body" helpers the card actions
  // need, since a listing prompt carries only a blurb. See usePromptContent.
  const { copied, copyContent, copyPrompt } = usePromptContent(showToast);

  // Favorites are My Library's only, and live on the server (useFavorites).
  const showFavoriteError = useCallback((message: string) => showToast('error', message), [showToast]);
  const { favorites, toggleFavorite, reloadFavorites } = useFavorites(showFavoriteError);

  // Recently viewed stays in this browser
  useEffect(() => {
    writeStorage('prompt-recently-viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // The library mode is remembered here, and kept in the URL by useLibraryRoute.
  useEffect(() => {
    writeStorage('library-mode', libraryMode);
  }, [libraryMode]);

  // Section / category / subcategory / ?prompt= — seeded from and written back to the URL.
  const {
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
  } = useLibraryRoute({ selectedPrompt, setSelectedPrompt, libraryMode, setLibraryMode });

  // The view follows from the URL state (PB-09): a prompt, the Favorites list, one category
  // (or one of its subcategories), or the whole section.
  const selectedSubcategory = useMemo(
    () => (!selectedPrompt && !showFavorites && activeCategory ? { category: activeCategory, subcategory: activeSubcategory ?? 'ALL' } : null),
    [selectedPrompt, showFavorites, activeCategory, activeSubcategory],
  );
  const showAllPrompts = !selectedPrompt && !showFavorites && !activeCategory;

  // The listing. A later request (a library switch, a refresh) wins over a slower earlier one.
  const listRequest = useRef(0);
  useEffect(() => {
    const request = ++listRequest.current;
    setIsLoading(true);
    fetchListing(libraryMode)
      .then(data => { if (request === listRequest.current) setPrompts(data); })
      .catch(err => {
        if (request !== listRequest.current) return;
        console.error('Failed to fetch prompts:', err);
        showToast('error', 'Failed to load prompts');
      })
      .finally(() => { if (request === listRequest.current) setIsLoading(false); });
  }, [showToast, libraryMode]);

  // Skill Packs are fetched here once and handed to SkillPacksView, so the sidebar, hero and
  // grid read one list and an add or remove refreshes all three. The counter drops a response
  // that a later request (a library switch) has overtaken.
  // Phones: the floating "+" slides away while the list scrolls down, so it never sits on a
  // card's action buttons, and comes back on the way up (PB-22, UX-09).
  const lastScrollTop = useRef(0);
  const [fabHidden, setFabHidden] = useState(false);
  const onContentScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    if (Math.abs(top - lastScrollTop.current) < 8) return;
    setFabHidden(top > lastScrollTop.current && top > 80);
    lastScrollTop.current = top;
  }, []);

  const packsRequest = useRef(0);
  const [packsLoading, setPacksLoading] = useState(true);
  const [packsError, setPacksError] = useState<string | null>(null);
  const fetchSkillPacks = useCallback(async () => {
    const request = ++packsRequest.current;
    setPacksLoading(true);
    setPacksError(null);
    try {
      const res = await fetch(`/api/skill-packs?library=${libraryMode}`);
      const data = await res.json().catch(() => null);
      if (!res.ok || !Array.isArray(data)) throw new Error(data?.error || `Failed to fetch skill packs (${res.status})`);
      if (request === packsRequest.current) setSkillPacks(data);
    } catch (err) {
      if (request !== packsRequest.current) return;
      console.error('Failed to fetch skill packs:', err);
      setSkillPacks([]);
      setPacksError(err instanceof Error ? err.message : 'Failed to load packs');
    } finally {
      if (request === packsRequest.current) setPacksLoading(false);
    }
  }, [libraryMode]);

  useEffect(() => {
    if (activeTab === 'skill-packs') void fetchSkillPacks();
  }, [activeTab, fetchSkillPacks]);

  // Section accent: index.css maps data-section → --section-c.
  const section = getSection(activeTab);
  useEffect(() => {
    document.documentElement.setAttribute('data-section', section.slug);
  }, [section.slug]);

  // ⌘K / Ctrl+K opens the command palette from anywhere.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Over another dialog it does nothing: the two would fight over #root's inert.
        if (document.querySelector('[role="dialog"][aria-modal="true"]:not([aria-label="Search the library"])')) return;
        setIsPaletteOpen(open => !open);
      }
      // Escape closes the phone drawer, as its scrim click does.
      if (e.key === 'Escape' && window.innerWidth < 768 && !document.querySelector('[role="dialog"][aria-modal="true"]')) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeSection = getSectionFolder(activeTab) || '4_Prompts';

  const {
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedTags,
    handleTagToggle,
    clearTags,
    sortOption,
    setSortOption,
    currentPage,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    sectionPrompts,
    categories,
    allTags,
    sortedPrompts,
    paginatedPrompts,
  } = usePromptFilters({
    prompts,
    activeSection,
    activeTab,
    activeCategory,
    activeSubcategory,
    selectedPrompt,
    libraryMode,
  });

  // The Libraries view belongs to Skills; leaving the section drops it.
  useEffect(() => {
    if (activeTab !== 'skills') setSkillView('skills');
  }, [activeTab, setSkillView]);

  const showLibraries = activeTab === 'skills' && skillView === 'libraries';

  const heroStats = useMemo(() => {
    if (activeTab === 'skill-packs') {
      return [
        { label: getSection(activeTab).noun, value: skillPacks.length },
        { label: 'Categories', value: new Set(skillPacks.map(p => p.category)).size },
        { label: 'Skills', value: skillPacks.reduce((n, p) => n + p.skillCount, 0) },
      ];
    }
    return [
      // Skills counts skills only; its library cards are the third counter.
      { label: getSection(activeTab).noun, value: activeTab === 'skills' ? sectionPrompts.filter(p => !isLibraryItem(p)).length : sectionPrompts.length },
      { label: 'Categories', value: Object.keys(categories).length },
      activeTab === 'skills'
        ? { label: 'Libraries', value: sectionPrompts.filter(isLibraryItem).length }
        : { label: 'Tags', value: allTags.length },
    ];
  }, [activeTab, skillPacks, sectionPrompts, categories, allTags.length]);

  const subcategoryPrompts = useMemo(() => {
    if (!selectedSubcategory) return [];
    if (selectedSubcategory.subcategory === 'ALL') {
      return sortedPrompts.filter(p => p.category === selectedSubcategory.category);
    }
    return sortedPrompts.filter(p =>
      p.category === selectedSubcategory.category &&
      p.subcategory === selectedSubcategory.subcategory
    );
  }, [selectedSubcategory, sortedPrompts]);

  const featuredPrompts = useMemo(() => {
    const featured = sectionPrompts
      .filter(p => p.tags.includes('featured'))
      .slice(0, 4);
    
    if (featured.length === 0) {
      // A copy: sectionPrompts is shared memoised state, and sort() works in place (BUG-16).
      return [...sectionPrompts]
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 4);
    }
    
    return featured;
  }, [sectionPrompts]);

  // Favorites live in My Library only; the Public Library has none.
  const favoritePrompts = useMemo(
    () => (libraryMode === 'my' ? prompts.filter(p => favorites.includes(p.id)) : []),
    [libraryMode, prompts, favorites],
  );

  /** The sidebar's Favorites view: starred My Library items in the current section. */
  // On Skills it follows the view: starred skills under Skills, starred library cards under Libraries.
  const sectionFavorites = useMemo(
    () => favoritePrompts
      .filter(p => p.section === activeSection)
      .filter(p => activeTab !== 'skills' || isLibraryItem(p) === (skillView === 'libraries'))
      .sort((a, b) => a.title.localeCompare(b.title)),
    [favoritePrompts, activeSection, activeTab, skillView],
  );

  /** The sidebar's Favorites count: starred items in this section, or starred packs on Skill Packs. */
  const sidebarFavoriteCount = activeTab === 'skill-packs'
    ? favorites.filter(id => id.startsWith('pack:')).length
    : sectionFavorites.length;

  const recentlyViewedPrompts = useMemo(() => {
    return recentlyViewed
      .map(id => prompts.find(p => p.id === id))
      .filter((p): p is Prompt => p !== undefined);
  }, [prompts, recentlyViewed]);

  const handleSubcategoryClick = useCallback((category: string, subcategory: string | 'ALL') => {
    setSelectedPrompt(null);
    setPromptPathParam(null);
    setShowFavorites(false);

    setActiveCategory(category);
    setActiveSubcategory(subcategory === 'ALL' ? null : subcategory);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [setActiveCategory, setActiveSubcategory, setPromptPathParam, setShowFavorites]);

  const toggleCategory = useCallback((cat: string) => {
    const isExpanded = expandedCategories[cat];
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    
    if (!isExpanded) {
      handleSubcategoryClick(cat, 'ALL');
    }
  }, [expandedCategories, handleSubcategoryClick]);

  // A newer open (another click, Back/Forward, a deep link) wins over a slower one still loading.
  const openRequest = useRef(0);
  const handlePromptClick = useCallback(async (prompt: Prompt, options?: { replace?: boolean }) => {
    const request = ++openRequest.current;
    // The listing copy is only a preview; opening it would let Copy and Edit
    // act on that instead of the prompt.
    let fullPrompt: Prompt;
    try {
      fullPrompt = await fetchFullPrompt(prompt);
    } catch (err) {
      if (request !== openRequest.current) return;
      console.error('Failed to fetch full prompt content:', err);
      showToast('error', 'Could not load this prompt. Try again.');
      if (options?.replace) replaceNextUrl();
      setPromptPathParam(null);
      return;
    }
    if (request !== openRequest.current) return;
    setCopiedShareLink(false);

    // Wherever the prompt lives: its library, section and category, in one history entry.
    if (options?.replace) replaceNextUrl();
    setSelectedPrompt(fullPrompt);
    setPromptPathParam(null);
    setShowFavorites(false);
    setLibraryMode(fullPrompt.isUserOwned ? 'my' : 'public');
    setActiveTab(getTabForFolder(fullPrompt.section));
    setActiveCategory(fullPrompt.category);
    setActiveSubcategory(null);

    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== fullPrompt.id);
      return [fullPrompt.id, ...filtered].slice(0, 10);
    });
  }, [showToast, replaceNextUrl, setPromptPathParam, setShowFavorites, setActiveTab, setActiveCategory, setActiveSubcategory]);

  const handleShowFavorites = useCallback(() => {
    setShowFavorites(true);
    setSelectedPrompt(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPromptPathParam(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [setShowFavorites, setActiveCategory, setActiveSubcategory, setPromptPathParam]);

  const handleShowAllPrompts = useCallback(() => {
    setShowFavorites(false);
    setActivePack(null);
    setSelectedPrompt(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPromptPathParam(null);
    setCopiedShareLink(false);
  }, [setShowFavorites, setActivePack, setActiveCategory, setActiveSubcategory, setPromptPathParam]);

  // Favorites are My Library's only, so switching to the Public Library leaves that view
  // (in place: the Favorites entry would be a dead end in the history).
  useEffect(() => {
    if (libraryMode !== 'my' && showFavorites) {
      replaceNextUrl();
      handleShowAllPrompts();
    }
  }, [libraryMode, showFavorites, handleShowAllPrompts, replaceNextUrl]);

  /** The in-page Back: prompt → its category → the whole section. */
  const handleBack = useCallback(() => {
    setCopiedShareLink(false);
    if (selectedPrompt && activeCategory) handleSubcategoryClick(activeCategory, 'ALL');
    else if (selectedSubcategory && selectedSubcategory.subcategory !== 'ALL') handleSubcategoryClick(selectedSubcategory.category, 'ALL');
    else handleShowAllPrompts();
  }, [selectedPrompt, selectedSubcategory, activeCategory, handleShowAllPrompts, handleSubcategoryClick]);

  const handleCopyShareLink = useCallback(async (prompt: Prompt) => {
    // A My Library item lives only on this machine, so its link points at this server, not the demo.
    const shareUrl = new URL(prompt.isUserOwned ? window.location.origin : PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', prompt.isUserOwned ? 'my' : 'public');
    shareUrl.searchParams.set('prompt', slugifyPromptPath(prompt.id));
    shareUrl.searchParams.set('section', getTabForFolder(prompt.section));
    shareUrl.searchParams.set('category', prompt.category);
    if (prompt.subcategory) shareUrl.searchParams.set('subcategory', prompt.subcategory);
    else shareUrl.searchParams.delete('subcategory');

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
    } catch (err) {
      console.error('Failed to copy link:', err);
      showToast('error', 'Failed to copy link');
      return;
    }
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
    showToast('success', prompt.isUserOwned ? 'Link copied. It opens in your own Promptbook' : 'Direct link copied');
  }, [showToast]);

  const handleCopySubsectionLink = useCallback(async (category: string, subcategory: string | 'ALL') => {
    const shareUrl = new URL(PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', 'public');
    shareUrl.searchParams.set('section', getSection(activeTab).id);
    shareUrl.searchParams.set('category', category);
    if (subcategory !== 'ALL') shareUrl.searchParams.set('subcategory', subcategory);
    else shareUrl.searchParams.delete('subcategory');
    shareUrl.searchParams.delete('prompt');

    try {
      await navigator.clipboard.writeText(shareUrl.toString());
    } catch (err) {
      console.error('Failed to copy link:', err);
      showToast('error', 'Failed to copy link');
      return;
    }
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2000);
    showToast('success', 'Subsection link copied');
  }, [activeTab, showToast]);

  // A `?prompt=` (a shared link, or Back/Forward onto a prompt) opens once the listing it is in
  // has loaded, in place of the history entry that named it.
  useEffect(() => {
    if (!promptPathParam || isLoading || selectedPrompt) return;
    const normalizedPromptPath = decodeURIComponent(promptPathParam)
      .replace(/^library\//, '')
      .replace(/^\/+|\/+$/g, '');
    // Public ids are library paths, My Library ids bare slugs, so one never matches the other.
    const matchingPrompt = prompts.find(prompt => slugifyPromptPath(prompt.id) === normalizedPromptPath);
    if (matchingPrompt) void handlePromptClick(matchingPrompt, { replace: true });
  }, [promptPathParam, isLoading, prompts, selectedPrompt, handlePromptClick]);

  const handleDownloadMarkdown = useCallback(async (prompt: Prompt) => {
    // A skill downloads as its folder zipped; a library card (Libraries/*.md) as plain markdown.
    if (prompt.section === '3_Skills' && !prompt.isUserOwned && prompt.id.endsWith('/SKILL.md')) {
      try {
        const skillDirPath = prompt.id.replace(/\/SKILL\.md$/, '');
        const response = await fetch(`/api/skills/download/${encodeURIComponent(skillDirPath)}`);
        
        if (!response.ok) {
          throw new Error('Failed to download skill');
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${prompt.category}.zip`;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 0); // after the click has started the download
        showToast('success', 'Skill downloaded as zip!');
      } catch (error) {
        console.error('Download error:', error);
        showToast('error', 'Failed to download skill');
      }
    } else {
      let content: string;
      try {
        content = toMarkdownFile({ ...prompt, ...(await fetchFullPrompt(prompt)) });
      } catch (err) {
        console.error('Download error:', err);
        showToast('error', 'Could not load this prompt, so nothing was downloaded');
        return;
      }
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prompt.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'prompt'}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 0);
      showToast('success', prompt.section === '3_Skills' ? 'Skill downloaded as markdown!' : 'Prompt downloaded!');
    }
  }, [showToast]);

  const refreshPrompts = useCallback(async () => {
    const request = ++listRequest.current;
    try {
      const data = await fetchListing(libraryMode);
      if (request === listRequest.current) setPrompts(data);
    } catch (err) {
      console.error('Failed to refresh prompts:', err); // the list on screen stays
    } finally {
      if (request === listRequest.current) setIsLoading(false);
    }
  }, [libraryMode]);

  /** A pack went into or out of My Library: its list and, in My Library, the skills it added. */
  const onPackLibraryChanged = useCallback(() => {
    void fetchSkillPacks();
    if (libraryMode === 'my') void refreshPrompts();
  }, [fetchSkillPacks, libraryMode, refreshPrompts]);

  const handleCopyToMyPrompts = useCallback(async (prompt: Prompt) => {
    if (prompt.section === 'My_Prompts') {
      showToast('info', 'This prompt is already in My Prompts');
      return;
    }

    setCopyingToMyPromptsId(prompt.id);

    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}/copy-to-my-prompts`, {
        method: 'POST'
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to copy prompt to My Prompts');
      }

      refreshPrompts();
      showToast('success', payload.message || 'Copied to My Prompts');
    } catch (error) {
      showToast('error', (error instanceof Error && error.message) || 'Failed to copy prompt to My Prompts');
    } finally {
      setCopyingToMyPromptsId(null);
    }
  }, [refreshPrompts, showToast]);

  const handleSavePrompt = useCallback(async (prompt: PromptDraft, options?: { favorite: boolean }) => {
    const method = prompt.id ? 'PUT' : 'POST';
    const url = prompt.id ? `/api/prompts/${encodeURIComponent(prompt.id)}` : '/api/prompts';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // The version the editor opened; the server refuses it if the file moved on since
        body: JSON.stringify({ ...prompt, version: prompt.id ? editingPrompt?.version : undefined })
      });

      if (response.status === 409) {
        // Changed elsewhere (another tab, an agent, a text editor). The editor keeps the draft and
        // now holds the saved copy's version, so saving again replaces it, knowingly (PB-22).
        const { current } = await response.json();
        setEditingPrompt(current);
        refreshPrompts();
        const conflict = new Error('This prompt changed somewhere else since you opened it. Your text is still here; Save again to replace the saved version.');
        conflict.name = 'ConflictError';
        throw conflict;
      }
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save prompt');
      }

      const saved: { id: string } = await response.json();
      if (options?.favorite) toggleFavorite(saved.id); // a new id is never starred yet, so this adds it
      refreshPrompts();
      if (prompt.id && selectedPrompt?.id === prompt.id) {
        // The detail view holds its own copy; refetch so it shows the edit.
        const fresh = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}`);
        if (fresh.ok) setSelectedPrompt(await fresh.json());
      }
      showToast('success', prompt.id ? 'Prompt updated successfully' : 'Prompt created successfully');
    } catch (error) {
      showToast('error', (error instanceof Error && error.message) || 'Failed to save prompt');
      throw error;
    }
  }, [refreshPrompts, selectedPrompt, showToast, editingPrompt, toggleFavorite]);

  const handlePullUpstream = useCallback(async (prompt: Prompt) => {
    if (prompt.upstream?.localEdits && !confirm('Replace your edited copy with the current Public Library version? Your edits will be lost.')) {
      return;
    }
    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(prompt.id)}/pull-upstream`, { method: 'POST' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Failed to update from the Public Library');
      setSelectedPrompt(payload);
      refreshPrompts();
      showToast('success', payload.message);
    } catch (error) {
      showToast('error', (error instanceof Error && error.message) || 'Failed to update from the Public Library');
    }
  }, [refreshPrompts, showToast]);

  const handleDeletePrompt = useCallback(async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/prompts/${encodeURIComponent(promptId)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete prompt');
      }

      refreshPrompts();
      showToast('success', 'Prompt deleted successfully');
      
      if (selectedPrompt?.id === promptId) setSelectedPrompt(null);
    } catch (error) {
      showToast('error', (error instanceof Error && error.message) || 'Failed to delete prompt');
    }
  }, [refreshPrompts, selectedPrompt, showToast]);

  const handleEditPrompt = useCallback(async (prompt: Prompt) => {
    // Seeding the editor from the listing copy would load the 200-character
    // preview and save it back over the real prompt.
    // On failure the editor stays shut, for the same reason.
    try {
      setEditingPrompt({ ...prompt, ...(await fetchFullPrompt(prompt)) }); // carries `version` for the save
    } catch (err) {
      console.error('Failed to load prompt for editing:', err);
      showToast('error', 'Could not load this prompt, so the editor was not opened');
      return;
    }
    setIsEditorOpen(true);
  }, [showToast]);

  const handleNewPrompt = useCallback(() => {
    if (libraryMode !== 'my') {
      setLibraryMode('my');
    }

    if (activeTab === 'skill-packs') {
      setActiveTab('prompt-library');
    }

    setEditingPrompt(null);
    setIsEditorOpen(true);
  }, [libraryMode, activeTab, setActiveTab]);

  /** Palette → prompt: handlePromptClick switches library and section to wherever it lives. */
  const openPromptFromPalette = useCallback((prompt: Prompt) => {
    void handlePromptClick(prompt);
  }, [handlePromptClick]);

  const openSectionFromPalette = useCallback((tab: LibraryTab) => {
    setActiveTab(tab);
    handleShowAllPrompts();
  }, [handleShowAllPrompts, setActiveTab]);

  /** Skills | Libraries | Packs. Packs is its own section; the other two are views of Skills. */
  const selectSkillKind = useCallback((kind: SkillKind) => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
    if (kind === 'packs') return openSectionFromPalette('skill-packs');
    openSectionFromPalette('skills'); // also leaves a category or prompt view for the list
    setSkillView(kind);
  }, [openSectionFromPalette, setSkillView]);

  /** Card-level props shared by the featured, all-prompts and subcategory grids. */
  const promptCardActions: PromptCardActions = useMemo(() => ({
    libraryMode,
    copyingToMyPromptsId,
    favorites,
    copied,
    onPromptClick: handlePromptClick,
    onCopyToMyPrompts: handleCopyToMyPrompts,
    onToggleFavorite: libraryMode === 'my' ? toggleFavorite : undefined,
    onEditPrompt: handleEditPrompt,
    onDeletePrompt: handleDeletePrompt,
    onDownloadMarkdown: handleDownloadMarkdown,
    onCopy: copyPrompt,
  }), [
    libraryMode,
    copyingToMyPromptsId,
    favorites,
    copied,
    handlePromptClick,
    handleCopyToMyPrompts,
    toggleFavorite,
    handleEditPrompt,
    handleDeletePrompt,
    handleDownloadMarkdown,
    copyPrompt,
  ]);

  /** Breadcrumb trail for the top bar: library › section › category › subcategory › prompt. */
  const crumbs = useMemo<Crumb[]>(() => {
    const trail: Crumb[] = [
      { label: libraryMode === 'my' ? 'My Library' : 'Public Library', onClick: handleShowAllPrompts },
      { label: getSectionDisplayName(activeTab), onClick: handleShowAllPrompts },
    ];
    if (showFavorites) {
      trail.push({ label: 'Favorites' });
    } else if (selectedSubcategory) {
      trail.push({ label: humanize(selectedSubcategory.category), onClick: () => handleSubcategoryClick(selectedSubcategory.category, 'ALL') });
      if (selectedSubcategory.subcategory !== 'ALL') trail.push({ label: humanize(selectedSubcategory.subcategory) });
    } else if (selectedPrompt) {
      if (selectedPrompt.category) {
        trail.push({ label: humanize(selectedPrompt.category), onClick: () => handleSubcategoryClick(selectedPrompt.category, 'ALL') });
      }
      trail.push({ label: selectedPrompt.title });
    }
    return trail;
  }, [libraryMode, activeTab, showFavorites, selectedSubcategory, selectedPrompt, handleShowAllPrompts, handleSubcategoryClick]);

  const showFeatured =
    activeTab !== 'skill-packs' && !showLibraries && libraryMode === 'public' && !debouncedSearch && selectedTags.length === 0 && featuredPrompts.length > 0;

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    {/* JS animations follow prefers-reduced-motion too; index.css only stills CSS ones. */}
    <MotionConfig reducedMotion="user">
    <div className="app-shell flex flex-col overflow-hidden">
    <a href="#main" className="skip">Skip to content</a>
    {/* The org's "View source" bar is for the hosted demo; the local app doesn't need it. */}
    {READ_ONLY && !EMBED && <SourceBar />}
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <SectionRail
        activeTab={activeTab}
        onSelectSection={tab => (tab === activeTab ? setIsSidebarOpen(open => !open) : openSectionFromPalette(tab))}
        onHome={() => openSectionFromPalette('prompt-library')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        joined={isSidebarOpen}
      />

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[var(--scrim)] backdrop-blur-sm md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        libraryMode={libraryMode}
        setLibraryMode={setLibraryMode}
        activeTab={activeTab}
        skillPacks={skillPacks}
        categories={categories}
        sectionPrompts={sectionPrompts}
        expandedCategories={expandedCategories}
        setExpandedCategories={setExpandedCategories}
        toggleCategory={toggleCategory}
        selectedSubcategory={selectedSubcategory}
        handleSubcategoryClick={handleSubcategoryClick}
        handleShowAllPrompts={handleShowAllPrompts}
        favoriteCount={sidebarFavoriteCount}
        showFavorites={showFavorites}
        onShowFavorites={handleShowFavorites}
        skillKind={activeTab === 'skill-packs' ? 'packs' : activeTab === 'skills' ? skillView : undefined}
        onSkillKind={selectSkillKind}
        onOpenLibrary={prompt => {
          void handlePromptClick(prompt);
          if (window.innerWidth < 768) setIsSidebarOpen(false);
        }}
      />

      {/* Main Content */}
      <main id="main" className="relative z-10 flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(open => !open)}
          activeTab={activeTab}
          onSelectSection={openSectionFromPalette}
          onOpenPalette={() => setIsPaletteOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onNewPrompt={handleNewPrompt}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Content Area */}
        <div className="relative flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-8" onScroll={onContentScroll}>
          <div className="glow" aria-hidden="true" />
          <div className="relative mx-auto flex min-h-full w-full max-w-[1440px] flex-col">
          <Breadcrumbs crumbs={crumbs} />
          {/* Hero Section */}
          {!selectedPrompt && !selectedSubcategory && !showFavorites && (
            <LibraryHero
              section={section}
              libraryMode={libraryMode}
              stats={heroStats}
              searchQuery={searchQuery}
              onSearchChange={activeTab === 'skill-packs' || showLibraries ? undefined : setSearchQuery}
            />
          )}

          <AnimatePresence mode="wait">
            {/* All Prompts Grid */}
            {showAllPrompts ? (
              <m.div
                key={`all-${activeTab}-${libraryMode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="w-full"
              >
                {(activeTab === 'skills' || activeTab === 'skill-packs') && (
                  <SkillKindSwitch value={activeTab === 'skill-packs' ? 'packs' : skillView} onChange={selectSkillKind} />
                )}

                {showLibraries && <SkillLibrariesView prompts={sectionPrompts} actions={promptCardActions} />}

                {activeTab !== 'skill-packs' && !showLibraries && (
                  <PromptListToolbar
                    totalCount={sortedPrompts.length}
                    favoritePrompts={favoritePrompts}
                    recentlyViewedPrompts={recentlyViewedPrompts}
                    onPromptSelect={openPromptFromPalette}
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    onClearTags={clearTags}
                    sortOption={sortOption}
                    onSortChange={setSortOption}
                  />
                )}

                {/* Featured Section */}
                {showFeatured && (
                  <m.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="mb-9"
                    aria-labelledby="featured-heading"
                  >
                    <div className="mb-3.5 flex items-center gap-2.5">
                      <span className="glyph h-7 w-7 rounded-[7px]">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <h2 id="featured-heading" className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                        Featured
                      </h2>
                      <span className="eyebrow ml-1 hidden sm:inline">Picked</span>
                    </div>
                    <PromptCardGrid prompts={featuredPrompts} actions={promptCardActions} columns="featured" />
                  </m.section>
                )}

                {/* Skill Packs View */}
                {activeTab === 'skill-packs' && (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      libraryMode={libraryMode}
                      packs={skillPacks}
                      loading={packsLoading}
                      error={packsError}
                      onReload={fetchSkillPacks}
                      onLibraryChanged={onPackLibraryChanged}
                      selectedPackId={activePack}
                      onSelectPack={setActivePack}
                      onToast={showToast}
                      favorites={favorites}
                      onToggleFavorite={libraryMode === 'my' ? toggleFavorite : undefined}
                    />
                  </Suspense>
                )}

                {/* All Prompts Section Header */}
                {showFeatured && (
                  <div className="mb-3.5 flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-[7px] border border-[var(--line)] bg-[var(--surface)] text-[var(--fg-3)]">
                      <LayoutGrid className="h-3.5 w-3.5" />
                    </span>
                    <h2 className="text-[15px] font-semibold tracking-tight text-[var(--fg)]">
                      All {lowerLabel(getSectionDisplayName(activeTab))}
                    </h2>
                  </div>
                )}

                {activeTab !== 'skill-packs' && !showLibraries && (
                  <PromptGrid
                    isLoading={isLoading}
                    prompts={paginatedPrompts}
                    totalCount={sortedPrompts.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPreviousPage={goToPreviousPage}
                    onNextPage={goToNextPage}
                    searchQuery={searchQuery}
                    onBrowsePublic={() => setLibraryMode('public')}
                    actions={promptCardActions}
                  />
                )}
              </m.div>

            ) : showFavorites ? (
              /* Favorites Grid */
              <m.div
                key={`favorites-${activeTab}-${libraryMode}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="w-full pt-6"
              >
                <div className="mb-6 flex min-w-0 items-start gap-3">
                  <button type="button" onClick={handleShowAllPrompts} className="icon-btn icon-btn-framed mt-0.5 h-9 w-9 shrink-0" aria-label="Back to all">
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <p className="eyebrow mb-1.5">{showLibraries ? 'Skill libraries' : getSectionDisplayName(activeTab)}</p>
                    <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--fg)] md:text-[1.85rem]">
                      Favorites
                    </h1>
                    <p className="mono mt-1.5 text-[12px] text-[var(--fg-4)]">
                      {sidebarFavoriteCount.toLocaleString()} {activeTab === 'skill-packs' ? (sidebarFavoriteCount === 1 ? 'pack' : 'packs') : sidebarFavoriteCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {activeTab === 'skill-packs' ? (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      libraryMode={libraryMode}
                      packs={skillPacks}
                      loading={packsLoading}
                      error={packsError}
                      onReload={fetchSkillPacks}
                      onLibraryChanged={onPackLibraryChanged}
                      selectedPackId={activePack}
                      onSelectPack={setActivePack}
                      onToast={showToast}
                      favorites={favorites}
                      onToggleFavorite={libraryMode === 'my' ? toggleFavorite : undefined}
                      onlyFavorites
                    />
                  </Suspense>
                ) : sectionFavorites.length > 0 ? (
                  <PromptCardGrid prompts={sectionFavorites} actions={promptCardActions} />
                ) : (
                  <p className="py-16 text-center text-[14px] text-[var(--fg-3)]">
                    No favorites in this section yet. Star a prompt to pin it here.
                  </p>
                )}
              </m.div>

            ) : selectedSubcategory && subcategoryPrompts.length > 0 ? (
              /* Subcategory Grid */
              <m.div
                key={`subcat-${selectedSubcategory.category}-${selectedSubcategory.subcategory}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="hue w-full pt-6"
                style={{ ['--hue' as string]: categoryHue(selectedSubcategory.category) }}
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <button type="button" onClick={handleShowAllPrompts} className="icon-btn icon-btn-framed mt-0.5 h-9 w-9 shrink-0" aria-label="Back to all">
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <p className="eyebrow mb-1.5">{getSectionDisplayName(activeTab)}</p>
                      <h1 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[var(--fg)] md:text-[1.85rem]">
                        {humanize(selectedSubcategory.category)}
                        {selectedSubcategory.subcategory !== 'ALL' && (
                          <>
                            <span className="mx-2 text-[var(--fg-5)]">/</span>
                            <span className="text-[var(--c)]">{humanize(selectedSubcategory.subcategory)}</span>
                          </>
                        )}
                      </h1>
                      <p className="mono mt-1.5 text-[12px] text-[var(--fg-4)]">
                        {subcategoryPrompts.length.toLocaleString()} {subcategoryPrompts.length === 1 ? 'prompt' : 'prompts'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleCopySubsectionLink(selectedSubcategory.category, selectedSubcategory.subcategory)}
                    icon={copiedShareLink ? <Check className="h-3.5 w-3.5 text-[var(--ok)]" /> : <Link2 className="h-3.5 w-3.5" />}
                  >
                    {copiedShareLink ? 'Link copied' : 'Copy section link'}
                  </Button>
                </div>

                {/* Sub-category pills: hop sideways without going back to the tree. */}
                {(categories[selectedSubcategory.category]?.size ?? 0) > 0 && (
                  <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Sub-categories">
                    {['ALL', ...Array.from(categories[selectedSubcategory.category]).sort()].map(sub => (
                      <button
                        key={sub}
                        type="button"
                        className="pill"
                        aria-pressed={selectedSubcategory.subcategory === sub}
                        onClick={() => handleSubcategoryClick(selectedSubcategory.category, sub)}
                      >
                        {sub === 'ALL' ? 'All' : humanize(sub)}
                      </button>
                    ))}
                  </div>
                )}

                <PromptCardGrid prompts={subcategoryPrompts} actions={promptCardActions} />
              </m.div>

            ) : selectedPrompt ? (
              /* Single Prompt Detail */
              <Suspense fallback={chunkSpinner}>
                <PromptDetail
                  prompt={selectedPrompt}
                  copyingToMyPromptsId={copyingToMyPromptsId}
                  copiedShareLink={copiedShareLink}
                  copied={copied}
                  onBack={handleBack}
                  onDownloadMarkdown={handleDownloadMarkdown}
                  onCopyShareLink={handleCopyShareLink}
                  onCopyToMyPrompts={handleCopyToMyPrompts}
                  onDeletePrompt={handleDeletePrompt}
                  onEditPrompt={handleEditPrompt}
                  onPullUpstream={handlePullUpstream}
                  onCopy={copyContent}
                  onSubcategoryClick={handleSubcategoryClick}
                  onShowAllPrompts={handleShowAllPrompts}
                  isFavorite={favorites.includes(selectedPrompt.id)}
                  onToggleFavorite={selectedPrompt.isUserOwned ? toggleFavorite : undefined}
                />
              </Suspense>

            ) : (
              /* Empty state */
              <m.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex min-h-[60vh] flex-col items-center justify-center text-center"
              >
                <span className="glyph mb-4 h-12 w-12 rounded-[12px]">
                  <LayoutGrid className="h-5 w-5" />
                </span>
                <p className="text-lg font-semibold text-[var(--fg)]">Nothing here</p>
                <p className="mt-1.5 max-w-sm text-[14px] text-[var(--fg-3)]">
                  This category has no prompts in the current library. Pick another one from the sidebar.
                </p>
                <Button size="sm" className="mt-5" onClick={handleShowAllPrompts}>
                  Back to all {lowerLabel(getSectionDisplayName(activeTab))}
                </Button>
              </m.div>
            )}
          </AnimatePresence>

          <footer className="site-footer mt-auto">
            <div className="row">
              <span className="mono">promptbook</span>
              <div className="right">
                <a href="https://github.com/ai-automation-tools/promptbook" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://promptbook.ai-automation-tools.dev" target="_blank" rel="noopener noreferrer">Homepage</a>
                <a href="https://ai-automation-tools.dev" target="_blank" rel="noopener noreferrer">ai-automation-tools.dev</a>
                <a href="#" data-ail-consent="manage">Cookie settings</a>
              </div>
            </div>
          </footer>
          </div>
        </div>
      </main>

      {/* Floating "new item" — phones only; the top bar carries it elsewhere. */}
      {!READ_ONLY && (
      <m.button
        type="button"
        whileTap={{ scale: 0.94 }}
        onClick={handleNewPrompt}
        className={cn(
          'fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_12px_32px_-8px_var(--glow)] transition-[translate] duration-200 sm:hidden',
          fabHidden && 'pointer-events-none translate-y-24',
        )}
        aria-label="New item"
        aria-hidden={fabHidden || undefined}
        tabIndex={fabHidden ? -1 : undefined}
      >
        <Plus className="h-6 w-6" />
      </m.button>
      )}

      {/* Prompt Editor Modal */}
      {isEditorOpen && (
        <Suspense fallback={null}>
          <PromptEditorModal
            isOpen={isEditorOpen}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingPrompt(null);
            }}
            onSave={handleSavePrompt}
            editingPrompt={editingPrompt}
            defaultSection={activeSection}
            existing={prompts}
          />
        </Suspense>
      )}

      {/* Command palette */}
      {isPaletteOpen && (
        <Suspense fallback={null}>
          <CommandPalette
            prompts={prompts}
            recentPrompts={recentlyViewedPrompts}
            onClose={() => setIsPaletteOpen(false)}
            onSelectPrompt={openPromptFromPalette}
            onSelectSection={openSectionFromPalette}
            onNewPrompt={handleNewPrompt}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSetTheme={setTheme}
          />
        </Suspense>
      )}

      {/* Settings */}
      {isSettingsOpen && (
        <Suspense fallback={null}>
          <SettingsModal
            theme={theme}
            setTheme={setTheme}
            palette={palette}
            setPalette={setPalette}
            recentCount={recentlyViewed.length}
            onClearLocalData={() => {
              setRecentlyViewed([]);
              showToast('success', 'Recently viewed cleared');
            }}
            onImported={message => {
              refreshPrompts();
              void reloadFavorites();
              showToast('success', message);
            }}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

    </div>
    </div>
    </MotionConfig>
    </LazyMotion>
  );
}
