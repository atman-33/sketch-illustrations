import { Globe, Grid, Heart, Search, Zap } from "lucide-react";
import { Link } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  featuredIllustrations,
  getAllIllustrations,
  popularCategories,
} from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export async function loader() {
  // In a real implementation, this would fetch from APIs
  return {
    featuredIllustrations,
    popularCategories,
    totalIllustrations: getAllIllustrations().length,
  };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  // biome-ignore lint/nursery/noShadow: ignore
  const { featuredIllustrations, popularCategories, totalIllustrations } =
    loaderData;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="py-16 text-center">
        <h1 className="mb-6 font-bold text-4xl md:text-6xl">
          Hand-Drawn Illustrations
          <br />
          <span className="text-primary">for Your Projects</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
          Discover beautiful, copyright-safe SVG illustrations perfect for
          blogs, presentations, and design tools like Miro. All illustrations
          are CC0 licensed.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/search">
            <Button className="w-full sm:w-auto" size="lg">
              <Search className="mr-2 h-5 w-5" />
              Start Searching
            </Button>
          </Link>
          <Link to="/categories">
            <Button className="w-full sm:w-auto" size="lg" variant="outline">
              <Grid className="mr-2 h-5 w-5" />
              Browse Categories
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-bold text-3xl">
          Why Choose Our Illustrations?
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <Zap className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Quick Copy & Download</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                One-click copy to clipboard or download as SVG/PNG. Perfect for
                fast workflows and productivity tools.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>CC0 Licensed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All illustrations are released under CC0 license. Use them
                freely in commercial and personal projects without attribution.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="mb-2 h-8 w-8 text-primary" />
              <CardTitle>Hand-Drawn Style</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Unique hand-drawn aesthetic that adds personality and warmth to
                your content. Perfect for modern, approachable designs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Featured Illustrations */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-bold text-3xl">Featured Illustrations</h2>
          <Link to="/search">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {featuredIllustrations.map((illustration) => (
            <IllustrationCard
              illustration={illustration}
              key={illustration.id}
              showQuickActions={true}
              size="md"
            />
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-bold text-3xl">Popular Categories</h2>
          <Link to="/categories">
            <Button variant="ghost">View All →</Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {popularCategories.map((category) => (
            <Link key={category.slug} to={`/category/${category.slug}`}>
              <Card className="text-center transition-all hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 font-semibold">{category.name}</h3>
                  <Badge variant="secondary">{category.count} items</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 font-bold text-3xl">Growing Collection</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-2 font-bold text-4xl text-primary">
                {totalIllustrations}+
              </div>
              <p className="text-muted-foreground">Total Illustrations</p>
            </div>
            <div>
              <div className="mb-2 font-bold text-4xl text-primary">
                {popularCategories.length}+
              </div>
              <p className="text-muted-foreground">Categories</p>
            </div>
            <div>
              <div className="mb-2 font-bold text-4xl text-primary">CC0</div>
              <p className="text-muted-foreground">License (Free to Use)</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 font-bold text-3xl">Ready to Get Started?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
          Browse our collection of hand-drawn illustrations and find the perfect
          one for your project.
        </p>
        <Link to="/search">
          <Button size="lg">
            <Search className="mr-2 h-5 w-5" />
            Explore Illustrations
          </Button>
        </Link>
      </section>
    </div>
  );
}
