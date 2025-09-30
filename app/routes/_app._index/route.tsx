import { ArrowRight, Copy, Download, Search } from "lucide-react";
import { Form, Link } from "react-router";
import { IllustrationCard } from "~/components/illustration-card";
import { Button } from "~/components/ui/button";
import {
  getAllIllustrations,
  getFeaturedIllustrations,
  getPopularCategories,
} from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const [featured, popular, allIllustrations] = await Promise.all([
    getFeaturedIllustrations(context, request),
    getPopularCategories(context, request),
    getAllIllustrations(context, request),
  ]);

  return {
    featuredIllustrations: featured,
    popularCategories: popular,
    totalIllustrations: allIllustrations.length,
  };
};

export default function HomePage({ loaderData }: Route.ComponentProps) {
  const { featuredIllustrations, popularCategories, totalIllustrations } =
    loaderData;

  return (
    <div className="space-y-20">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 text-white">
        <div className="-z-10 absolute inset-0 opacity-60">
          <div className="-translate-x-1/2 pointer-events-none absolute inset-y-0 left-1/2 blur-[120px]">
            <div className="h-[420px] w-[420px] rounded-full bg-gradient-to-br from-purple-500/40 via-blue-500/30 to-pink-500/30" />
          </div>
        </div>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 px-4 py-24 text-center md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-1.5 text-white/80 text-xs uppercase tracking-[0.2em]">
            Instant sketch library
          </span>
          <div className="space-y-6">
            <h1 className="font-semibold text-4xl leading-tight tracking-tight md:text-6xl">
              Find and copy sketch illustrations in seconds.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-white/70 md:text-lg">
              Search thousands of CC0 SVGs, copy them as PNG with one tap, and
              drop them straight into your decks, whiteboards, or canvases.
            </p>
          </div>
          <Form
            action="/search"
            className="flex w-full max-w-2xl items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 pl-4 backdrop-blur transition focus-within:border-white/40"
            method="get"
          >
            <Search className="h-5 w-5 text-white/60" />
            <input
              aria-label="Search illustrations"
              className="flex-1 bg-transparent text-base text-white placeholder:text-white/50 focus:outline-none"
              name="q"
              placeholder='Try "remote work" or "education"'
              type="search"
            />
            <Button
              className="rounded-xl"
              size="lg"
              type="submit"
              variant="secondary"
            >
              Search
            </Button>
          </Form>
          <div className="grid w-full max-w-2xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Copy className="mb-3 h-5 w-5 text-white/60" />
              <p className="text-sm text-white/70">
                Copy SVG or PNG instantly with smart fallbacks.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Search className="mb-3 h-5 w-5 text-white/60" />
              <p className="text-sm text-white/70">
                Filter by tags, keywords, or curated categories.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Download className="mb-3 h-5 w-5 text-white/60" />
              <p className="text-sm text-white/70">
                Download originals for your design systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-2xl text-slate-900 dark:text-slate-100">
              Featured illustrations
            </h2>
            <p className="text-slate-500 text-sm dark:text-slate-400">
              A rotating set of our most copied sketches.
            </p>
          </div>
          <Button asChild variant="ghost">
            <Link className="inline-flex items-center gap-2" to="/search">
              Browse all {totalIllustrations}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {featuredIllustrations.map((illustration) => (
            <IllustrationCard
              illustration={illustration}
              key={illustration.id}
              showQuickActions
              size="md"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-20 md:px-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between">
          <div>
            <h2 className="font-semibold text-2xl text-slate-900 dark:text-slate-100">
              Quick categories
            </h2>
            <p className="text-slate-500 text-sm dark:text-slate-400">
              Jump straight into a visual theme.
            </p>
          </div>
          <span className="text-slate-400 text-xs dark:text-slate-500">
            {popularCategories.length} curated sets
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          {popularCategories.map((category) => (
            <Link
              className="rounded-full border border-slate-200 bg-white px-5 py-2 font-medium text-slate-600 text-sm shadow-sm transition hover:border-purple-400 hover:text-purple-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-purple-500 dark:hover:text-purple-300"
              key={category.slug}
              to={`/category/${category.slug}`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
