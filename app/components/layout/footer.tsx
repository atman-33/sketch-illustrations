import { Logo } from "~/components/logo";

type FooterProps = {
  contactEmail?: string;
};

export function Footer({ contactEmail }: FooterProps) {
  return (
    <footer className="border-white/10 border-t bg-white/80 backdrop-blur dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-slate-500 text-sm md:flex-row md:items-center md:justify-between dark:text-slate-400">
        <Logo className="text-base" to="/" />
        <div className="flex flex-col gap-2 text-xs md:items-end md:text-sm">
          <span>Built for lightning-fast illustration workflows.</span>
          {contactEmail && (
            <a
              className="hover:text-purple-500"
              href={`mailto:${contactEmail}`}
            >
              {contactEmail}
            </a>
          )}
          <span>© {new Date().getFullYear()} Sketch Illustrations</span>
        </div>
      </div>
    </footer>
  );
}
