/** biome-ignore-all lint/style/useNamingConvention: ignore */
import { Logo } from "~/components/logo";
import { ThemeToggle } from "~/components/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-gray-200/50 border-b bg-white/80 backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-900/80">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo to="/home" />

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
