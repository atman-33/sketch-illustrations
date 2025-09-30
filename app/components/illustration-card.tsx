/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Check, Copy, Download, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { actionUtils } from "~/lib/api";
import type { ActionStatus, Illustration } from "~/lib/types";

type IllustrationCardProps = {
  illustration: Illustration;
  showQuickActions?: boolean;
  size?: "sm" | "md" | "lg";
  onView?: (illustration: Illustration) => void;
};

const imageHeights: Record<
  NonNullable<IllustrationCardProps["size"]>,
  string
> = {
  sm: "max-w-[140px]",
  md: "max-w-[180px]",
  lg: "max-w-[220px]",
};

export function IllustrationCard({
  illustration,
  showQuickActions = true,
  size = "md",
  onView,
}: IllustrationCardProps) {
  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>("idle");

  const previewSizeClass = imageHeights[size];

  const handleCopySvg = async () => {
    setCopyStatus("processing");
    try {
      const svgContent = await actionUtils.getSvgContent(illustration.svgPath);
      if (!svgContent) {
        throw new Error("Failed to load SVG content");
      }

      const success = await actionUtils.copyToClipboard(svgContent, "svg");
      if (success) {
        setCopyStatus("success");
        toast.success("SVG copied to clipboard!");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } else {
        // Fallback to download
        const filename = actionUtils.generateFilename(illustration, "svg");
        actionUtils.triggerDownload(svgContent, filename);
        toast.info("SVG downloaded (clipboard not available)");
        setCopyStatus("idle");
      }
    } catch (_error) {
      setCopyStatus("error");
      toast.error("Failed to copy SVG");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const handleDownloadSvg = async () => {
    setDownloadStatus("processing");
    try {
      const svgContent = await actionUtils.getSvgContent(illustration.svgPath);
      if (!svgContent) {
        throw new Error("Failed to load SVG content");
      }

      const filename = actionUtils.generateFilename(illustration, "svg");
      actionUtils.triggerDownload(svgContent, filename);
      setDownloadStatus("success");
      toast.success("SVG downloaded!");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (_error) {
      setDownloadStatus("error");
      toast.error("Failed to download SVG");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    }
  };

  const handleView = () => {
    onView?.(illustration);
  };

  return (
    <Card className="group hover:-translate-y-1 flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-sm transition hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
      <CardContent className="flex h-full flex-col items-center gap-3 p-5">
        <div
          className={`relative mx-auto aspect-square w-full ${previewSizeClass} overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800`}
        >
          {/** biome-ignore lint/nursery/useImageSize: ignore */}
          {/** biome-ignore lint/performance/noImgElement: ignore */}
          <img
            alt={illustration.title}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            src={illustration.svgPath}
          />
          {showQuickActions && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <Button
                aria-label="Copy SVG"
                className="rounded-xl bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                disabled={copyStatus === "processing"}
                onClick={handleCopySvg}
                size="icon"
                variant="ghost"
              >
                {copyStatus === "processing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                  // biome-ignore lint/style/noNestedTernary: ignore
                ) : copyStatus === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                aria-label="Download SVG"
                className="rounded-xl bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900"
                disabled={downloadStatus === "processing"}
                onClick={handleDownloadSvg}
                size="icon"
                variant="ghost"
              >
                {downloadStatus === "processing" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                  // biome-ignore lint/style/noNestedTernary: ignore
                ) : downloadStatus === "success" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 flex-1 font-semibold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-slate-50 dark:group-hover:text-purple-300">
            {illustration.title}
          </h3>
          {onView && (
            <Button
              aria-label="Preview illustration"
              className="rounded-xl"
              onClick={handleView}
              size="icon"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
