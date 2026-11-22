/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import type Fuse from 'fuse.js';
import { type Prompt } from '../components/PromptCard';
import { isLibraryItem } from '../components/SkillLibraries';

export type SortOption = 'title-asc' | 'title-desc' | 'modified-desc' | 'modified-asc';

export const ITEMS_PER_PAGE = 50;

/** Tab id → the `library/` folder prefix its prompts must live under. */
const TAB_PATH_PREFIX: Record<string, string> = {
  'agent-guides': '1_Guides/',
  agents: '2_Agents/',
  skills: '3_Skills/',
  'prompt-library': '4_Prompts/',
  'system-prompts': '5_System_Prompts/',
  'mcp-servers': '6_MCP_Servers/',
};

interface UsePromptFiltersArgs {
  prompts: Prompt[];
  activeSection: string;
  activeTab: string;
  activeCategory: string | null;
  activeSubcategory: string | null;
  /** Category/subcategory filters are bypassed while a prompt is open. */
  selectedPrompt: Prompt | null;
  libraryMode: 'public' | 'my';
}

/**
 * Owns search / tag / sort / pagination state and everything derived from it.
 * Extracted from App.tsx — behavior-preserving.
 */
export function usePromptFilters({
  prompts,
  activeSection,
  activeTab,
  activeCategory,
  activeSubcategory,
  selectedPrompt,
  libraryMode,
}: UsePromptFiltersArgs) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('title-asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [FuseCtor, setFuseCtor] = useState<typeof Fuse | null>(null);
  useEffect(() => {
    if (debouncedSearch && !FuseCtor) void import('fuse.js').then(mod => setFuseCtor(() => mod.default));
  }, [debouncedSearch, FuseCtor]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, debouncedSearch, selectedTags, sortOption, activeCategory, activeSubcategory]);

  const sectionPrompts = useMemo(() => {
    return prompts.filter(p => p.section === activeSection);
  }, [prompts, activeSection]);

  const categories = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    // The skills category tree leaves out library cards (Libraries/), as the skills list does.
    sectionPrompts.filter(p => activeTab !== 'skills' || !isLibraryItem(p)).forEach(p => {
      if (!map[p.category]) map[p.category] = new Set();
      if (p.subcategory) map[p.category].add(p.subcategory);
    });
    return map;
  }, [sectionPrompts, activeTab]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sectionPrompts.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [sectionPrompts]);

  const filteredPrompts = useMemo(() => {
    const prefix = TAB_PATH_PREFIX[activeTab];

    let currentPrompts = sectionPrompts.filter(prompt => {
      if (prompt.isUserOwned || libraryMode === 'my') {
        return true;
      }
      return !prefix || prompt.id.startsWith(prefix);
    });

    if (activeCategory && !selectedPrompt) {
      currentPrompts = currentPrompts.filter(p => p.category === activeCategory);
      if (activeSubcategory) {
        currentPrompts = currentPrompts.filter(p => p.subcategory === activeSubcategory);
      }
    }

    // Library cards have their own view (Skills › Libraries), not a place in the skills list;
    // a picked category (the detail page's "Libraries" crumb) still lists what is in it.
    if (activeTab === 'skills' && !activeCategory) {
      currentPrompts = currentPrompts.filter(p => !isLibraryItem(p));
    }

    if (selectedTags.length > 0) {
      currentPrompts = currentPrompts.filter(prompt =>
        selectedTags.every(tag => prompt.tags.includes(tag))
      );
    }

    if (!debouncedSearch) {
      return currentPrompts;
    }

    const query = debouncedSearch.trim().toLowerCase();

    // Title matches rank above metadata matches; fuzzy search is the fallback.
    const titleStartsWith = currentPrompts.filter(p => p.title.toLowerCase().startsWith(query));
    const titleContains = currentPrompts.filter(
      p => !p.title.toLowerCase().startsWith(query) && p.title.toLowerCase().includes(query)
    );
    const metadataContains = currentPrompts.filter(p => {
      if (p.title.toLowerCase().includes(query)) return false;
      const inCategory = p.category?.toLowerCase().includes(query);
      const inSubcategory = p.subcategory?.toLowerCase().includes(query);
      const inTags = Array.isArray(p.tags) && p.tags.some(tag => tag.toLowerCase().includes(query));
      return inCategory || inSubcategory || inTags;
    });

    const strictOrdered = [...titleStartsWith, ...titleContains, ...metadataContains];
    if (strictOrdered.length > 0) {
      return strictOrdered;
    }

    // Fuzzy matching is the fallback when nothing matches as typed; fuse.js loads on the
    // first search instead of with the page (PB-11). Until then the fallback finds nothing.
    if (!FuseCtor) return [];
    const fuse = new FuseCtor(currentPrompts, {
      keys: [
        { name: 'title', weight: 10 },
        { name: 'tags', weight: 3 },
        { name: 'category', weight: 2 },
        { name: 'subcategory', weight: 2 },
      ],
      includeScore: true,
      threshold: 0.22,
      ignoreLocation: true,
      minMatchCharLength: 3,
    });

    return fuse.search(debouncedSearch).map(result => result.item);
  }, [
    FuseCtor,
    sectionPrompts,
    debouncedSearch,
    activeTab,
    selectedTags,
    activeCategory,
    activeSubcategory,
    selectedPrompt,
    libraryMode,
  ]);

  const sortedPrompts = useMemo(() => {
    const promptsToSort = [...filteredPrompts];

    switch (sortOption) {
      case 'title-asc':
        return promptsToSort.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return promptsToSort.sort((a, b) => b.title.localeCompare(a.title));
      case 'modified-desc':
        return promptsToSort.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
      case 'modified-asc':
        return promptsToSort.sort((a, b) => new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime());
      default:
        return promptsToSort;
    }
  }, [filteredPrompts, sortOption]);

  const totalPages = useMemo(() => {
    return Math.ceil(sortedPrompts.length / ITEMS_PER_PAGE);
  }, [sortedPrompts.length]);

  // The list can shrink under the page (a library switch, a delete): never show past the end.
  const page = Math.max(1, Math.min(currentPage, totalPages));

  const paginatedPrompts = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return sortedPrompts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedPrompts, page]);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }, []);

  const clearTags = useCallback(() => setSelectedTags([]), []);

  const goToPreviousPage = useCallback(() => {
    setCurrentPage(Math.max(1, page - 1));
  }, [page]);

  const goToNextPage = useCallback(() => {
    setCurrentPage(Math.min(totalPages, page + 1));
  }, [page, totalPages]);

  return {
    // state
    searchQuery,
    setSearchQuery,
    debouncedSearch,
    selectedTags,
    handleTagToggle,
    clearTags,
    sortOption,
    setSortOption,
    currentPage: page,
    totalPages,
    goToPreviousPage,
    goToNextPage,
    // derived
    sectionPrompts,
    categories,
    allTags,
    sortedPrompts,
    paginatedPrompts,
  };
}
