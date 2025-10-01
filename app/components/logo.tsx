import { Link } from "react-router";

type LogoProps = {
  to: string;
  className?: string;
};

export const Logo = ({ to, className = "" }: LogoProps) => (
  <Link
    className={`group flex items-center gap-3 font-display text-lg tracking-tight ${className}`}
    to={to}
  >
    <span className="sketch-border sketch-shadow group-hover:-translate-y-0.5 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-secondary/70 transition-transform duration-300 dark:bg-secondary/40">
      {/** biome-ignore lint/nursery/useImageSize: ignore */}
      {/** biome-ignore lint/performance/noImgElement: ignore */}
      <img
        alt="Sketch Illustrations logo"
        className="h-full w-full object-cover mix-blend-multiply dark:mix-blend-screen"
        src="/favicons/android-chrome-192x192.png"
      />
    </span>
    <span className="text-slate-900 transition-colors duration-300 group-hover:text-primary dark:text-page-foreground dark:text-primary dark:group-hover:text-primary">
      Sketch Illustrations
    </span>
  </Link>
);
