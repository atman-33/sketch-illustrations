import { Link } from "react-router";

type LogoProps = {
  to: string;
  className?: string;
};

export const Logo = ({ to, className = "" }: LogoProps) => (
  <Link
    className={`group flex items-center gap-3 font-semibold tracking-tight ${className}`}
    to={to}
  >
    <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
      {/** biome-ignore lint/nursery/useImageSize: ignore */}
      {/** biome-ignore lint/performance/noImgElement: ignore */}
      <img
        alt="Sketch Illustrations logo"
        className="h-full w-full object-cover"
        src="/favicons/android-chrome-192x192.png"
      />
    </span>
    <span className="text-lg text-slate-900 transition-colors duration-300 group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-300">
      Sketch Illustrations
    </span>
  </Link>
);
