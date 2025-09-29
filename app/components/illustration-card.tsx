/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Check, Copy, Download, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { actionUtils, conversionApi } from "~/lib/api";
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
  sm: "h-32",
  md: "h-40",
  lg: "h-48",
};

export function IllustrationCard({
  illustration,
  showQuickActions = true,
  size = "md",
  onView,
}: IllustrationCardProps) {
  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>("idle");

  const previewHeight = imageHeights[size];

  const handleCopyPng = async () => {
    setCopyStatus("processing");
    try {
      const { width = 512, height = 512 } = illustration.dimensions ?? {};
      const conversionResult = await conversionApi.convertToPng(
        illustration.svgPath,
        {
          width,
          height,
          transparent: true,
          quality: 90,
        }
      );

      if (!(conversionResult.success && conversionResult.data)) {
        throw new Error(conversionResult.error || "PNG conversion failed");
      }

      const pngBlob = conversionResult.data;
      const success = await actionUtils.copyToClipboard(pngBlob, "png");
      if (success) {
        setCopyStatus("success");
        toast.success("PNG copied to clipboard!");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } else {
        // Fallback to download
        const filename = actionUtils.generateFilename(illustration, "png");
        actionUtils.triggerDownload(pngBlob, filename);
        toast.info("PNG downloaded (clipboard not available)");
        setCopyStatus("idle");
      }
    } catch (_error) {
      setCopyStatus("error");
      toast.error("Failed to copy PNG");
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
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <div
          className={`${previewHeight} relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 via-white to-slate-200 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800`}
        >
          {/** biome-ignore lint/nursery/useImageSize: ignore */}
          {/** biome-ignore lint/performance/noImgElement: ignore */}
          <img
            alt={illustration.title}
            className="absolute inset-0 h-full w-full scale-95 object-contain transition-transform duration-300 group-hover:scale-100"
            loading="lazy"
            src={illustration.svgPath}
          />
          <div className="absolute top-4 left-4 rounded-full bg-black/60 px-3 py-1 font-medium text-white text-xs uppercase tracking-wide shadow-md backdrop-blur">
            {illustration.category}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="line-clamp-2 font-semibold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-slate-50 dark:group-hover:text-purple-300">
            {illustration.title}
          </h3>
          <div className="flex flex-wrap gap-2 text-slate-500 text-xs dark:text-slate-400">
            {illustration.tags.slice(0, 3).map((tag) => (
              <span
                className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800"
                key={tag}
              >
                {tag}
              </span>
            ))}
            {illustration.tags.length > 3 && (
              <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                +{illustration.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {showQuickActions && (
          <div className="mt-auto flex items-center gap-2">
            <Button
              className="flex-1 rounded-xl"
              disabled={copyStatus === "processing"}
              onClick={handleCopyPng}
              size="sm"
              variant="secondary"
            >
              {copyStatus === "processing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                // biome-ignore lint/style/noNestedTernary: ignore
              ) : copyStatus === "success" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Copy className="mr-2 h-4 w-4" />
              )}
              Copy PNG
            </Button>
            <Button
              className="flex-1 rounded-xl"
              disabled={downloadStatus === "processing"}
              onClick={handleDownloadSvg}
              size="sm"
              variant="outline"
            >
              {downloadStatus === "processing" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                // biome-ignore lint/style/noNestedTernary: ignore
              ) : downloadStatus === "success" ? (
                <Check className="mr-2 h-4 w-4" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              SVG
            </Button>
            {onView && (
              <Button
                className="rounded-xl"
                onClick={handleView}
                size="icon"
                variant="ghost"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
