import { Logo } from "~/components/logo";
import { DoodleFrame } from "~/components/ui/doodle-frame";

type FooterProps = {
  contactEmail?: string;
};

export function Footer({ contactEmail }: FooterProps) {
  return (
    <footer className="bg-page-light py-10 text-slate-600 dark:text-slate-300">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <DoodleFrame className="flex flex-col gap-6 bg-page-light px-5 py-6 md:flex-row md:items-center md:justify-between">
          <Logo className="text-base" to="/" />
          <div className="flex flex-col gap-2 text-xs md:items-end md:text-sm">
            <span className="font-display text-base dark:text-page-foreground">
              Built for lightning-fast illustration workflows.
            </span>
            {contactEmail && (
              <a
                className="sketch-underline hover:text-primary"
                href={`mailto:${contactEmail}`}
              >
                {contactEmail}
              </a>
            )}
            <span>© {new Date().getFullYear()} Sketch Illustrations</span>
          </div>
        </DoodleFrame>
      </div>
    </footer>
  );
}
