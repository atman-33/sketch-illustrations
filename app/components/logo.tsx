import { Link } from "react-router";

type LogoProps = {
  to: string;
  className?: string;
};

export function Logo({ to, className = "" }: LogoProps) {
  return (
    <Link
      className={`group flex items-center gap-3 font-semibold tracking-tight ${className}`}
      to={to}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-base text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
        SI
      </span>
      <span className="text-lg text-slate-900 transition-colors duration-300 group-hover:text-purple-600 dark:text-slate-100 dark:group-hover:text-purple-300">
        Sketch Illustrations
      </span>
    </Link>
  );
}
