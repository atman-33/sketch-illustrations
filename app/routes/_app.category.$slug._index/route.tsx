import { ArrowLeft, Filter, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import type { Illustration } from "~/lib/types";
import type { Route } from "./+types/route";

// Mock data - will be replaced with actual API calls
const mockIllustrations: Illustration[] = [
  {
    id: "work-laptop",
    title: "Laptop Computer",
    tags: ["computer", "laptop", "device", "work"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/laptop.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "work-meeting",
    title: "Team Meeting",
    tags: ["meeting", "team", "collaboration", "business"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/meeting.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "work-presentation",
    title: "Business Presentation",
    tags: ["presentation", "chart", "business", "analytics"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/presentation.svg",
    dimensions: { width: 512, height: 512 },
  },
];

const mockCategory = {
  slug: "work",
  name: "Work & Business",
  description:
    "Professional illustrations perfect for business presentations, blog posts, and professional documentation",
  icon: "briefcase",
  illustrationCount: 45,
};

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader({ params }: Route.LoaderArgs) {
  // biome-ignore lint/correctness/noUnusedVariables: ignore
  const { slug } = params;

  // In a real implementation, this would fetch from an API
  // const category = await illustrationApi.getCategoryBySlug(slug);
  // const illustrations = await illustrationApi.getIllustrationsByCategory(slug);

  return {
    category: mockCategory,
    illustrations: mockIllustrations,
  };
}

export default function CategoryDetailPage({
  loaderData,
}: Route.ComponentProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { category, illustrations } = loaderData;

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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          className="inline-flex items-center text-muted-foreground text-sm hover:text-foreground"
          to="/categories"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Categories
        </Link>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{category.name}</h1>
        <p className="mb-4 text-muted-foreground">{category.description}</p>
        <Badge variant="secondary">
          {category.illustrationCount} illustrations
        </Badge>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search illustrations in this category..."
            value={searchQuery}
          />
        </div>

        {/* Tag Filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Filter by tags:</span>
            {selectedTags.length > 0 && (
              <Button
                className="text-xs"
                onClick={() => setSelectedTags([])}
                size="sm"
                variant="ghost"
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                className="cursor-pointer hover:bg-primary/20"
                key={tag}
                onClick={() => toggleTag(tag)}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Showing {filteredIllustrations.length} of {illustrations.length}{" "}
          illustrations
          {searchQuery && ` for "${searchQuery}"`}
          {selectedTags.length > 0 &&
            ` tagged with: ${selectedTags.join(", ")}`}
        </p>
      </div>

      {/* Illustrations Grid */}
      {filteredIllustrations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredIllustrations.map((illustration) => (
            <IllustrationCard
              illustration={illustration}
              key={illustration.id}
              showQuickActions={true}
              size="md"
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">
            No illustrations found matching your criteria
          </p>
          <div className="space-x-2">
            {searchQuery && (
              <Button onClick={() => setSearchQuery("")} variant="outline">
                Clear search
              </Button>
            )}
            {selectedTags.length > 0 && (
              <Button onClick={() => setSelectedTags([])} variant="outline">
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Load More (for future pagination) */}
      {filteredIllustrations.length > 0 &&
        filteredIllustrations.length < category.illustrationCount && (
          <div className="mt-12 text-center">
            <Button variant="outline">Load More Illustrations</Button>
          </div>
        )}
    </div>
  );
}
