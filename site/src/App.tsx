/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback, lazy, Suspense, type ComponentType } from 'react';
import { ArrowLeft, Check, LayoutGrid, Link2, Plus, Sparkles } from 'lucide-react';
import SourceBar from './components/SourceBar';
import { LazyMotion, domAnimation, m, AnimatePresence } from 'motion/react';
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
import { useFavoritePrompts } from './hooks/useFavoritePrompts';
import { fetchFullPrompt, usePromptContent } from './hooks/usePromptContent';
import { toMarkdownFile } from './lib/markdown-file';
import { useLibraryRoute, slugifyPromptPath, type LibraryTab } from './hooks/useLibraryRoute';
import { usePalette, useTheme } from './hooks/useTheme';
import { categoryHue, getSection, getSectionFolder, getSectionDisplayName, getTabForFolder, humanize, lowerLabel } from './lib/sections';
import { READ_ONLY } from './lib/mode';

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

const PUBLIC_SHARE_ORIGIN = 'https://promptbook-demo.ai-automation-tools.dev';

export default function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<{category: string, subcategory: string | 'ALL'} | null>(null);
  const [showAllPrompts, setShowAllPrompts] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [theme, setTheme] = useTheme();
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
    const saved = localStorage.getItem('library-mode');
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('library');
    if (urlMode === 'public' || urlMode === 'my') return urlMode;
    return (saved === 'public' || saved === 'my') ? saved as 'public' | 'my' : 'public';
  });
  
  // Navigation & Organization
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('prompt-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('prompt-recently-viewed');
    return saved ? JSON.parse(saved) : [];
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

  // Persist favorites and recently viewed to localStorage
  useEffect(() => {
    localStorage.setItem('prompt-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('prompt-recently-viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Persist library mode to localStorage and URL
  useEffect(() => {
    localStorage.setItem('library-mode', libraryMode);
    const url = new URL(window.location.href);
    url.searchParams.set('library', libraryMode);
    window.history.replaceState({}, '', url.toString());
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
    promptPathParam,
    setPromptPathParam,
  } = useLibraryRoute({ selectedPrompt, setSelectedPrompt, setLibraryMode });

  useEffect(() => {
    setIsLoading(true);
    const url = `/api/prompts?library=${libraryMode}&lightweight=true`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPrompts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch prompts:', err);
        showToast('error', 'Failed to load prompts');
        setIsLoading(false);
      });
  }, [showToast, libraryMode]);

  useEffect(() => {
    if (activeTab !== 'skill-packs') {
      return;
    }
    fetch(`/api/skill-packs?library=${libraryMode}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || 'Failed to fetch skill packs');
        }
        return data;
      })
      .then(data => setSkillPacks(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error('Failed to fetch skill packs:', err);
        setSkillPacks([]);
      });
  }, [activeTab, libraryMode]);

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
        setIsPaletteOpen(open => !open);
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
      .filter(p => p.tags.includes('featured') || favorites.includes(p.id))
      .slice(0, 4);
    
    if (featured.length === 0) {
      return sectionPrompts
        .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
        .slice(0, 4);
    }
    
    return featured;
  }, [sectionPrompts, favorites]);

  // One set of favorites, the same in both libraries
  const favoritePrompts = useFavoritePrompts(favorites, prompts);

  /** The sidebar's Favorites view: starred items in the current section, from either library. */
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
    setSelectedSubcategory({ category, subcategory });
    setSelectedPrompt(null);
    setShowAllPrompts(false);
    setShowFavorites(false);

    setActiveCategory(category);
    setActiveSubcategory(subcategory === 'ALL' ? null : subcategory);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const toggleCategory = useCallback((cat: string) => {
    const isExpanded = expandedCategories[cat];
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
    
    if (!isExpanded) {
      handleSubcategoryClick(cat, 'ALL');
    }
  }, [expandedCategories, handleSubcategoryClick]);

  const handlePromptClick = useCallback(async (prompt: Prompt) => {
    // The listing copy is only a preview; opening it would let Copy and Edit
    // act on that instead of the prompt.
    let fullPrompt: Prompt;
    try {
      fullPrompt = await fetchFullPrompt(prompt);
    } catch (err) {
      console.error('Failed to fetch full prompt content:', err);
      showToast('error', 'Could not load this prompt. Try again.');
      return;
    }
    setPromptPathParam(prompt.isUserOwned ? null : slugifyPromptPath(prompt.id));
    setCopiedShareLink(false);

    setSelectedPrompt(fullPrompt);
    setSelectedSubcategory(null);
    setShowAllPrompts(false);
    setShowFavorites(false);

    setActiveCategory(fullPrompt.category);
    setActiveSubcategory(null);
    
    setRecentlyViewed(prev => {
      const filtered = prev.filter(id => id !== fullPrompt.id);
      return [fullPrompt.id, ...filtered].slice(0, 10);
    });
  }, [showToast]);

  const handleShowFavorites = useCallback(() => {
    setShowFavorites(true);
    setShowAllPrompts(false);
    setSelectedPrompt(null);
    setSelectedSubcategory(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPromptPathParam(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleShowAllPrompts = useCallback(() => {
    setShowAllPrompts(true);
    setShowFavorites(false);
    setSelectedPrompt(null);
    setSelectedSubcategory(null);
    setActiveCategory(null);
    setActiveSubcategory(null);
    setPromptPathParam(null);
    setCopiedShareLink(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('category');
    url.searchParams.delete('subcategory');
    url.searchParams.delete('prompt');
    window.history.pushState({}, '', url.toString());
  }, []);

  const handleBack = useCallback(() => {
    if (selectedPrompt) {
      setSelectedPrompt(null);
      setPromptPathParam(null);
      setCopiedShareLink(false);
      
      if (activeCategory) {
        handleSubcategoryClick(activeCategory, 'ALL');
      }
    } else if (selectedSubcategory) {
      const category = selectedSubcategory.category;
      setSelectedSubcategory(null);
      setActiveSubcategory(null);
      
      handleSubcategoryClick(category, 'ALL');
    } else if (activeCategory) {
      setActiveCategory(null);
      handleShowAllPrompts();
    } else {
      handleShowAllPrompts();
    }
  }, [selectedPrompt, selectedSubcategory, activeCategory, handleShowAllPrompts, handleSubcategoryClick]);

  const handleCopyShareLink = useCallback(async (prompt: Prompt) => {
    if (prompt.isUserOwned) {
      showToast('info', 'Direct links are only available for public library items');
      return;
    }

    const shareUrl = new URL(PUBLIC_SHARE_ORIGIN);
    shareUrl.searchParams.set('library', 'public');
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
    showToast('success', 'Direct link copied');
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

  useEffect(() => {
    if (!promptPathParam || prompts.length === 0 || selectedPrompt) {
      return;
    }

    const normalizedPromptPath = decodeURIComponent(promptPathParam)
      .replace(/^library\//, '')
      .replace(/^\/+|\/+$/g, '');
    const matchingPrompt = prompts.find(prompt => {
      if (prompt.isUserOwned) return false;
      return slugifyPromptPath(prompt.id) === normalizedPromptPath;
    });

    if (matchingPrompt) {
      const nextTab = getTabForFolder(matchingPrompt.section);

      if (activeTab !== nextTab) setActiveTab(nextTab);
      if (libraryMode !== 'public') setLibraryMode('public');
      if (activeCategory !== matchingPrompt.category) setActiveCategory(matchingPrompt.category);
      if (activeSubcategory !== matchingPrompt.subcategory) setActiveSubcategory(matchingPrompt.subcategory);

      void handlePromptClick(matchingPrompt);
    }
  }, [promptPathParam, prompts, selectedPrompt, activeTab, libraryMode, activeCategory, activeSubcategory, handlePromptClick]);

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
        URL.revokeObjectURL(url);
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
      URL.revokeObjectURL(url);
      showToast('success', prompt.section === '3_Skills' ? 'Skill downloaded as markdown!' : 'Prompt downloaded!');
    }
  }, [showToast]);

  const toggleFavorite = useCallback((promptId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      if (prev.includes(promptId)) {
        return prev.filter(id => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
  }, []);

  const refreshPrompts = useCallback(async () => {
    const url = `/api/prompts?library=${libraryMode}&lightweight=true`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to refresh prompts');
      }

      setPrompts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
      setPrompts([]);
    }
  }, [libraryMode]);

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

  const handleSavePrompt = useCallback(async (prompt: PromptDraft) => {
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
        // Changed elsewhere (another tab, an agent, a text editor): show that
        // version instead of overwriting it. The editor reloads with it.
        const { current } = await response.json();
        setEditingPrompt(current);
        refreshPrompts();
        throw new Error('This prompt changed somewhere else since you opened it. The editor now shows the saved version; make your edit again.');
      }
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save prompt');
      }

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
  }, [refreshPrompts, selectedPrompt, showToast, editingPrompt]);

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
      
      if (selectedPrompt?.id === promptId) {
        setSelectedPrompt(null);
        setShowAllPrompts(true);
      }
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
  }, [libraryMode, activeTab]);

  /** Palette → prompt: switch library/section to wherever it lives, then open it. */
  const openPromptFromPalette = useCallback((prompt: Prompt) => {
    if (prompt.isUserOwned) {
      if (libraryMode !== 'my') setLibraryMode('my');
    } else {
      if (libraryMode !== 'public') setLibraryMode('public');
      const tab = getTabForFolder(prompt.section);
      if (tab !== activeTab) setActiveTab(tab);
    }
    void handlePromptClick(prompt);
  }, [libraryMode, activeTab, handlePromptClick]);

  const openSectionFromPalette = useCallback((tab: LibraryTab) => {
    setActiveTab(tab);
    handleShowAllPrompts();
  }, [handleShowAllPrompts]);

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
    onToggleFavorite: toggleFavorite,
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

  /** A favorite can live in the other library: opening it switches there first. */
  const favoriteCardActions: PromptCardActions = useMemo(
    () => ({ ...promptCardActions, onPromptClick: openPromptFromPalette }),
    [promptCardActions, openPromptFromPalette],
  );

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
    <LazyMotion features={domAnimation} strict>
    <div className="app-shell flex flex-col overflow-hidden">
    <a href="#main" className="skip">Skip to content</a>
    {/* The org's "View source" bar is for the hosted demo; the local app doesn't need it. */}
    {READ_ONLY && <SourceBar />}
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
        <div className="relative flex-1 overflow-y-auto px-4 pb-24 md:px-8 md:pb-8">
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
                      <span className="eyebrow ml-1 hidden sm:inline">Picked and favourites</span>
                    </div>
                    <PromptCardGrid prompts={featuredPrompts} actions={promptCardActions} columns="featured" />
                  </m.section>
                )}

                {/* Skill Packs View */}
                {activeTab === 'skill-packs' && (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      libraryMode={libraryMode}
                      onToast={showToast}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
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
                    <p className="mono mt-1.5 text-[11px] text-[var(--fg-4)]">
                      {sidebarFavoriteCount.toLocaleString()} {activeTab === 'skill-packs' ? (sidebarFavoriteCount === 1 ? 'pack' : 'packs') : sidebarFavoriteCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>

                {activeTab === 'skill-packs' ? (
                  <Suspense fallback={chunkSpinner}>
                    <SkillPacksView
                      libraryMode={libraryMode}
                      onToast={showToast}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      onlyFavorites
                    />
                  </Suspense>
                ) : sectionFavorites.length > 0 ? (
                  <PromptCardGrid prompts={sectionFavorites} actions={favoriteCardActions} />
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
                      <p className="mono mt-1.5 text-[11px] text-[var(--fg-4)]">
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
                  libraryMode={libraryMode}
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
                  onToggleFavorite={toggleFavorite}
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
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-[0_12px_32px_-8px_var(--glow)] sm:hidden"
        aria-label="New item"
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
            favoriteCount={favorites.length}
            recentCount={recentlyViewed.length}
            onClearLocalData={() => {
              setFavorites([]);
              setRecentlyViewed([]);
              showToast('success', 'Favourites and recent prompts cleared');
            }}
            onClose={() => setIsSettingsOpen(false)}
          />
        </Suspense>
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

    </div>
    </div>
    </LazyMotion>
  );
}
