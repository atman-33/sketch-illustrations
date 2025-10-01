/** biome-ignore-all lint/style/useNamingConvention: ignore */
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";
import { DoodleFrame } from "~/components/ui/doodle-frame";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="mx-auto max-w-6xl px-4 pt-4 pb-3 md:px-6">
        <DoodleFrame className="flex items-center justify-between gap-4 bg-page-light px-4 py-3">
          <Logo className="shrink-0" to="/" />

          <nav className="sketch-doodle hidden items-center gap-6 rounded-full px-3 py-2 font-display text-slate-700 text-sm tracking-wide md:flex dark:text-slate-200">
            <Link
              className="sketch-underline transition-all hover:text-accent"
              to="/search"
            >
              Search
            </Link>
            <Link
              className="sketch-underline transition-all hover:text-accent"
              to="/categories"
            >
              Categories
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              className="hidden md:inline-flex"
              size="sm"
              variant="default"
            >
              <Link to="/search">
                <Search className="mr-2 h-4 w-4" /> Quick Search
              </Link>
            </Button>
            <Button
              asChild
              className="md:hidden"
              size="icon"
              variant="secondary"
            >
              <Link to="/search">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DoodleFrame>
      </div>
    </header>
  );
}
