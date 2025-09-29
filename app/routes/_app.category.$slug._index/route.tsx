import { ArrowLeft, Search, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { HTTP_STATUS } from "~/lib/constants/http-status";
import {
  getIllustrationsByCategory,
  getMockCategory,
} from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader({ params }: Route.LoaderArgs) {
  const { slug } = params;
  if (!slug) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  const category = getMockCategory(slug);
  if (!category) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  const illustrations = getIllustrationsByCategory(slug);

  return {
    category,
    illustrations,
  };
}

export default function CategoryDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { category, illustrations } = loaderData;
  const totalAvailable = category.illustrationCount ?? illustrations.length;

  // Get all unique tags from illustrations
  const allTags = Array.from(
    new Set(illustrations.flatMap((illustration) => illustration.tags))
  ).sort();

  // Filter illustrations based on search and selected tags
  const filteredIllustrations = illustrations.filter((illustration) => {
    const matchesSearch =
      searchQuery === "" ||
      illustration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      illustration.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => illustration.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6">
      <div className="flex items-center gap-3 text-slate-500 text-sm dark:text-slate-400">
        <ArrowLeft className="h-4 w-4" />
        <Link className="hover:text-purple-500" to="/categories">
          Back to categories
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm md:p-8 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-semibold text-2xl text-slate-900 dark:text-slate-50">
              {category.name}
            </h1>
            <p className="max-w-2xl text-slate-500 text-sm dark:text-slate-400">
              {category.description ??
                "Explore curated illustrations in this theme."}
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500 text-xs dark:bg-slate-800 dark:text-slate-400">
            {totalAvailable.toString()} illustrations
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-4 w-4 text-slate-400" />
            <Input
              className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-base shadow-sm focus-visible:border-purple-400 dark:border-slate-700 dark:bg-slate-900"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or tag..."
              value={searchQuery}
            />
          </div>
          {selectedTags.length > 0 && (
            <Button
              onClick={() => setSelectedTags([])}
              size="sm"
              variant="ghost"
            >
              <X className="mr-2 h-4 w-4" /> Clear tags
            </Button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  className={`rounded-full border px-4 py-1 text-xs transition ${
                    active
                      ? "border-purple-500 bg-purple-500 text-white"
                      : "border-slate-200 text-slate-500 hover:border-purple-400 hover:text-purple-600 dark:border-slate-700 dark:text-slate-400 dark:hover:border-purple-500 dark:hover:text-purple-300"
                  }`}
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  type="button"
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="text-slate-500 text-sm dark:text-slate-400">
        Showing {filteredIllustrations.length} of {illustrations.length} results
        {searchQuery && ` for "${searchQuery}"`}
        {selectedTags.length > 0 && ` tagged with ${selectedTags.join(", ")}`}.
      </div>

      {filteredIllustrations.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredIllustrations.map((illustration) => (
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
          No illustrations match your filters yet.
        </div>
      )}
    </div>
  );
}
