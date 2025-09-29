/** biome-ignore-all lint/style/useNamingConvention: ignore */
import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router";
import { Logo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-white/10 border-b bg-white/70 backdrop-blur-xl dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 md:px-6">
        <Logo className="shrink-0" to="/" />

        <nav className="hidden items-center gap-6 font-medium text-slate-600 text-sm md:flex dark:text-slate-300">
          <Link
            className="transition-colors hover:text-purple-600"
            to="/search"
          >
            Search
          </Link>
          <Link
            className="transition-colors hover:text-purple-600"
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
          <Button asChild className="md:hidden" size="icon" variant="secondary">
            <Link to="/search">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
