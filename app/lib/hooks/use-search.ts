import { useCallback, useEffect, useMemo, useState } from "react";
import { illustrationApi } from "~/lib/api";
import type { Illustration, SearchResult } from "~/lib/types";

export type UseSearchOptions = {
  initialQuery?: string;
  initialCategory?: string;
  debounceMs?: number;
};

export type UseSearchReturn = {
  query: string;
  setQuery: (query: string) => void;
  category: string;
  setCategory: (category: string) => void;
  results: SearchResult | null;
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  performSearch: () => void;
  clearSearch: () => void;
};

/**
 * useSearch: Remote search with debouncing and basic error handling.
 */
export function useSearch({
  initialQuery = "",
  initialCategory = "",
  debounceMs = 500,
}: UseSearchOptions = {}): UseSearchReturn {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Execute the search against API
  const performSearch = useCallback(async () => {
    // If query is empty, clear results/flags instead of hitting API
    if (!query.trim()) {
      setResults(null);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await illustrationApi.searchIllustrations(
        query,
        category || undefined
      );

      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || "Search failed");
        setResults(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, category]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setCategory("");
    setResults(null);
    setError(null);
    setHasSearched(false);
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (query.trim() || category) {
        // biome-ignore lint/complexity/noVoid: ignore
        void performSearch();
      }
    }, debounceMs);

    return () => window.clearTimeout(timeoutId);
  }, [query, category, debounceMs, performSearch]);

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    isLoading,
    error,
    hasSearched,
    performSearch,
    clearSearch,
  };
}

/**
 * useIllustrationFilter: Local in-memory filtering by query, tags, and category.
 */
export function useIllustrationFilter(illustrations: Illustration[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Compute filtered results (memoized to avoid unnecessary recomputations)
  const filteredIllustrations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return illustrations.filter((illustration) => {
      // Text search against title and tags
      const matchesSearch =
        !q ||
        illustration.title.toLowerCase().includes(q) ||
        illustration.tags.some((tag) => tag.toLowerCase().includes(q));

      // Tag filter: all selected tags must be included
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => illustration.tags.includes(tag));

      // Category filter: exact match when selected
      const matchesCategory =
        !selectedCategory || illustration.category === selectedCategory;

      return matchesSearch && matchesTags && matchesCategory;
    });
  }, [illustrations, searchQuery, selectedTags, selectedCategory]);

  // Unique tag list
  const allTags = useMemo(
    () =>
      Array.from(
        new Set(illustrations.flatMap((illustration) => illustration.tags))
      ).sort(),
    [illustrations]
  );

  // Unique category list
  const allCategories = useMemo(
    () =>
      Array.from(
        new Set(illustrations.map((illustration) => illustration.category))
      ).sort(),
    [illustrations]
  );

  // Toggle a tag in the selection list
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setSelectedCategory("");
  };

  // Boolean flag for UI (normalize to actual boolean)
  const hasFilters =
    Boolean(searchQuery.trim()) ||
    selectedTags.length > 0 ||
    Boolean(selectedCategory);

  return {
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    selectedCategory,
    setSelectedCategory,
    filteredIllustrations,
    allTags,
    allCategories,
    toggleTag,
    clearFilters,
    hasFilters,
  };
}

/**
 * useSearchSuggestions: Very lightweight client-side autocomplete from
 * titles and tags (top 8 by early-match position).
 */
export function useSearchSuggestions(
  query: string,
  illustrations: Illustration[]
) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ignore
  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const queryLower = query.toLowerCase();
    const suggestionSet = new Set<string>();

    // Add matching titles
    for (const illustration of illustrations) {
      if (illustration.title.toLowerCase().includes(queryLower)) {
        suggestionSet.add(illustration.title);
      }
    }

    // Add matching tags
    for (const illustration of illustrations) {
      for (const tag of illustration.tags) {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestionSet.add(tag);
        }
      }
    }

    // Limit and sort by first-match index (lower index = more relevant)
    const sortedSuggestions = Array.from(suggestionSet)
      // biome-ignore lint/style/noMagicNumbers: ignore
      .slice(0, 8)
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(queryLower);
        const bIndex = b.toLowerCase().indexOf(queryLower);
        return aIndex - bIndex;
      });

    setSuggestions(sortedSuggestions);
  }, [query, illustrations]);

  return suggestions;
}
