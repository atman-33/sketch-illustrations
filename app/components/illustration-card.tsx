/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Check, Copy, Download, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
    <Card className="group hover:-translate-y-1 flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)+1rem)] border-2 border-slate-300/60 bg-page-light shadow-[4px_4px_0_rgba(33,33,33,0.12)] transition-transform duration-200 hover:rotate-[-0.5deg] hover:shadow-[7px_7px_0_rgba(33,33,33,0.18)] dark:border-slate-700/60">
      <CardContent className="flex h-full flex-col items-center gap-4 p-6">
        <div
          className={`relative mx-auto aspect-square w-full ${previewSizeClass} overflow-hidden rounded-[calc(var(--radius)+0.75rem)] border-2 border-slate-400/60 border-dashed bg-white/80 backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-900/60`}
        >
          {/** biome-ignore lint/nursery/useImageSize: ignore */}
          {/** biome-ignore lint/performance/noImgElement: ignore */}
          <img
            alt={illustration.title}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105 dark:bg-primary/40"
            loading="lazy"
            src={illustration.svgPath}
          />
          {showQuickActions && (
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Copy SVG"
                    className="sketch-border bg-white/50 text-slate-700 shadow-none backdrop-blur transition hover:bg-white dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900"
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
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Copy SVG</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    aria-label="Download SVG"
                    className="sketch-border bg-white/50 text-slate-700 shadow-none backdrop-blur transition hover:bg-white dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900"
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
                </TooltipTrigger>
                <TooltipContent sideOffset={4}>Download SVG</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        <div className="flex w-full items-start justify-between gap-3">
          <h3 className="sketch-underline line-clamp-2 flex-1 font-display text-lg text-slate-900 transition-colors group-hover:text-primary dark:text-page-foreground dark:text-white dark:group-hover:text-primary">
            {illustration.title}
          </h3>
          {onView && (
            <Button
              aria-label="Preview illustration"
              className="sketch-border"
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
