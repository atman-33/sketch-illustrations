import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { loadCategories } from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const categories = await loadCategories(context, request);

  return {
    categories,
  };
};

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { categories } = loaderData;

  const filteredCategories = categories.filter((category) => {
    const normalizedQuery = searchQuery.toLowerCase();
    const nameMatches = category.name.toLowerCase().includes(normalizedQuery);
    const description = category.description ?? "";
    const descriptionMatches = description
      .toLowerCase()
      .includes(normalizedQuery);

    return nameMatches || descriptionMatches;
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 md:px-6">
      <div className="space-y-3">
        <h1 className="font-semibold text-2xl text-slate-900 dark:text-slate-50">
          Browse categories
        </h1>
        <p className="max-w-2xl text-slate-500 text-sm dark:text-slate-400">
          Tap a theme to jump directly into matching illustrations.
        </p>
      </div>

      <div className="relative">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-4 w-4 text-slate-400" />
        <Input
          className="h-12 rounded-2xl border-slate-200 bg-white pl-11 text-base shadow-sm focus-visible:border-purple-400 dark:border-slate-700 dark:bg-slate-900"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search categories..."
          value={searchQuery}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Link
            className="group hover:-translate-y-1 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            key={category.slug}
            to={`/category/${category.slug}`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg text-slate-900 transition-colors group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-300">
                {category.name}
              </h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-500 text-xs dark:bg-slate-800 dark:text-slate-400">
                {(category.illustrationCount ?? 0).toString()} items
              </span>
            </div>
            <p className="mt-3 text-slate-500 text-sm dark:text-slate-400">
              {category.description ?? "Discover curated illustrations."}
            </p>
          </Link>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="rounded-3xl border border-slate-200 border-dashed py-12 text-center text-slate-400 dark:border-slate-700 dark:text-slate-500">
          No categories found for "{searchQuery}".
          <Button
            className="ml-2"
            onClick={() => setSearchQuery("")}
            variant="link"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
