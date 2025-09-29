import { Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  getIllustrationsByCategory,
  getMockSearchResults,
  mockCategories,
} from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query =
    url.searchParams.get("query") || url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || "";

  const searchResults = getMockSearchResults(query, category || undefined);
  const categories = mockCategories.map((item) => ({
    slug: item.slug,
    name: item.name,
    count: getIllustrationsByCategory(item.slug).length,
  }));

  return {
    searchResults,
    categories,
    initialQuery: query,
    initialCategory: category,
  };
}

export default function SearchPage({ loaderData }: Route.ComponentProps) {
  const [_searchParams, setSearchParams] = useSearchParams();
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

    // Simulate API delay
    // biome-ignore lint/style/noMagicNumbers: ignore
    setTimeout(() => setIsSearching(false), 300);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        searchQuery !== loaderData.initialQuery ||
        selectedCategory !== loaderData.initialCategory
      ) {
        performSearch();
      }
      // biome-ignore lint/style/noMagicNumbers: ignore
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedCategory,
    loaderData.initialQuery,
    loaderData.initialCategory,
    // biome-ignore lint/correctness/useExhaustiveDependencies: ignore
    performSearch,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSearchParams({});
  };

  const hasFilters = searchQuery || selectedCategory;
  const hasResults = searchResults.illustrations.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Search Illustrations</h1>
        <p className="text-muted-foreground">
          Find the perfect hand-drawn illustration for your project
        </p>
      </div>

      {/* Search Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
            <Input
              className="pl-10"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tags, or keywords..."
              value={searchQuery}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">Category:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => setSelectedCategory("")}
                variant={selectedCategory ? "outline" : "default"}
              >
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge
                  className="cursor-pointer hover:bg-primary/20"
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  variant={
                    selectedCategory === category.slug ? "default" : "outline"
                  }
                >
                  {category.name} ({category.count})
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <Button
              className="w-fit"
              onClick={clearFilters}
              size="sm"
              variant="ghost"
            >
              <X className="mr-1 h-4 w-4" />
              Clear all filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      <div className="space-y-6">
        {/* Results Summary */}
        {hasFilters && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">
                {isSearching
                  ? "Searching..."
                  : `Found ${searchResults.total} illustrations`}
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory &&
                  ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {hasResults ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {searchResults.illustrations.map((illustration) => (
              <IllustrationCard
                illustration={illustration}
                key={illustration.id}
                showQuickActions={true}
                size="md"
              />
            ))}
          </div>
          // biome-ignore lint/style/noNestedTernary: ignore
        ) : hasFilters ? (
          <div className="py-12 text-center">
            <p className="mb-2 font-medium text-lg">No illustrations found</p>
            <p className="mb-4 text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear filters and try again
            </Button>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="mb-2 font-medium text-lg">Start your search</p>
            <p className="text-muted-foreground">
              Enter keywords or select a category to find illustrations
            </p>
          </div>
        )}

        {/* Load More (for pagination) */}
        {hasResults &&
          searchResults.total > searchResults.illustrations.length && (
            <div className="text-center">
              <Button variant="outline">Load More Results</Button>
            </div>
          )}
      </div>

      {/* Search Tips */}
      {!hasFilters && (
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-lg">Search Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>
                • Use specific keywords like "laptop", "meeting", or "coffee"
              </li>
              <li>• Try different variations of your search terms</li>
              <li>• Filter by category to narrow down results</li>
              <li>• All illustrations are CC0 licensed and free to use</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
