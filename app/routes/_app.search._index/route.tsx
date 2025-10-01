import { Filter, Loader2, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  getCategoriesWithCounts,
  searchIllustrations,
} from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query =
    url.searchParams.get("query") || url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";

  const [searchResults, categories] = await Promise.all([
    searchIllustrations(query, category || undefined, context, request),
    getCategoriesWithCounts(context, request),
  ]);

  return {
    searchResults,
    categories,
    initialQuery: query,
    initialCategory: category,
  };
};

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const [_params, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(loaderData.initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(
    loaderData.initialCategory
  );
  const [isSearching, setIsSearching] = useState(false);

  const { searchResults, categories } = loaderData;

  const performSearch = () => {
    setIsSearching(true);
    const newSearchParams = new URLSearchParams();

    if (searchQuery) {
      newSearchParams.set("q", searchQuery);
    }
    if (selectedCategory) {
      newSearchParams.set("category", selectedCategory);
    }

    setSearchParams(newSearchParams);
    // biome-ignore lint/style/noMagicNumbers: ignore
    setTimeout(() => setIsSearching(false), 200);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        searchQuery !== loaderData.initialQuery ||
        selectedCategory !== loaderData.initialCategory
      ) {
        performSearch();
      }
      // biome-ignore lint/style/noMagicNumbers: ignore
    }, 350);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSearchParams({});
  };

  const hasFilters = Boolean(searchQuery || selectedCategory);
  const hasResults = searchResults.illustrations.length > 0;

  const summary = useMemo(() => {
    if (isSearching) {
      return "Searching…";
    }
    const parts: string[] = [`${searchResults.total} results`];
    if (searchQuery) {
      parts.push(`for "${searchQuery}"`);
    }
    if (selectedCategory) {
      const name = categories.find((c) => c.slug === selectedCategory)?.name;
      if (name) {
        parts.push(`in ${name}`);
      }
    }
    return parts.join(" ");
  }, [
    categories,
    isSearching,
    searchQuery,
    searchResults.total,
    selectedCategory,
  ]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6">
      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-lg backdrop-blur md:p-8 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <h1 className="font-semibold text-2xl text-slate-900 tracking-tight dark:text-slate-50">
              Search illustrations
            </h1>
            <p className="max-w-xl text-slate-500 text-sm dark:text-slate-400">
              Type a keyword or tap a category. Results update instantly.
            </p>
          </div>
          {hasFilters && (
            <Button onClick={clearFilters} size="sm" variant="ghost">
              <X className="mr-2 h-4 w-4" /> Clear filters
            </Button>
          )}
        </div>

        <div className="mt-6 grid gap-4">
          <div className="relative flex flex-cols items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-purple-400 dark:border-slate-700 dark:bg-slate-900">
            <Search className="h-5 w-5 text-slate-400" />
            <Input
              className="border-0 p-0 px-2 text-base focus-visible:outline-none focus-visible:ring-0 dark:bg-transparent"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tags, or keywords..."
              value={searchQuery}
            />
            {isSearching && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedCategory("")}
              size="sm"
              variant={selectedCategory ? "outline" : "default"}
            >
              <Filter className="mr-2 h-4 w-4" /> All
            </Button>
            {/** biome-ignore lint/style/noMagicNumbers: ignore */}
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category.slug}
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev === category.slug ? "" : category.slug
                  )
                }
                size="sm"
                variant={
                  selectedCategory === category.slug ? "default" : "outline"
                }
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-slate-500 text-sm dark:text-slate-400">
        <span>{summary}</span>
      </div>

      {hasResults ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {searchResults.illustrations.map((illustration) => (
            <IllustrationCard
              illustration={illustration}
              key={illustration.id}
              showQuickActions
              size="md"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 border-dashed p-16 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
          Start typing to discover hand-drawn illustrations.
        </div>
      )}
    </div>
  );
}
