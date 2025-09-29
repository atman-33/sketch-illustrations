import { Grid, List, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { mockCategories } from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
// biome-ignore lint/correctness/noUnusedFunctionParameters: ignore
export async function loader({ request }: Route.LoaderArgs) {
  // In a real implementation, this would fetch from an API
  return {
    categories: mockCategories,
  };
}

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">Browse Categories</h1>
        <p className="text-muted-foreground">
          Explore our collection of hand-drawn illustrations organized by
          category
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            value={searchQuery}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setViewMode("grid")}
            size="sm"
            variant={viewMode === "grid" ? "default" : "outline"}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            size="sm"
            variant={viewMode === "list" ? "default" : "outline"}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            : "space-y-4"
        }
      >
        {filteredCategories.map((category) => (
          <Link key={category.slug} to={`/category/${category.slug}`}>
            <Card className="group h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg transition-colors group-hover:text-primary">
                    {category.name}
                  </CardTitle>
                  <Badge variant="secondary">
                    {(category.illustrationCount ?? 0).toString()} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground text-sm">
                  {category.description ?? "Discover curated illustrations."}
                </p>
                <div className="flex items-center justify-between">
                  <Button
                    className="group-hover:bg-primary/10"
                    size="sm"
                    variant="ghost"
                  >
                    Browse →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No categories found matching "{searchQuery}"
          </p>
          <Button
            className="mt-2"
            onClick={() => setSearchQuery("")}
            variant="ghost"
          >
            Clear search
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 text-center">
        <p className="text-muted-foreground text-sm">
          {categories.length} categories •{" "}
          {categories.reduce(
            (acc, cat) => acc + (cat.illustrationCount ?? 0),
            0
          )}{" "}
          total illustrations
        </p>
      </div>
    </div>
  );
}
