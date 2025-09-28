/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Check, Copy, Download, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
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

export function IllustrationCard({
  illustration,
  showQuickActions = true,
  size = "md",
  onView,
}: IllustrationCardProps) {
  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>("idle");

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  };

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
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        {/* Illustration Preview */}
        <div
          className={`${sizeClasses[size]} mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50`}
        >
          {/** biome-ignore lint/nursery/useImageSize: ignore */}
          {/** biome-ignore lint/performance/noImgElement: ignore */}
          <img
            alt={illustration.title}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            src={illustration.svgPath}
          />
        </div>

        {/* Title and Category */}
        <div className="mb-3">
          <h3 className="mb-1 line-clamp-2 font-medium text-sm">
            {illustration.title}
          </h3>
          <Badge className="text-xs" variant="secondary">
            {illustration.category}
          </Badge>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {illustration.tags.slice(0, 3).map((tag) => (
              <Badge className="text-xs" key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
            {illustration.tags.length > 3 && (
              <Badge className="text-xs" variant="outline">
                +{illustration.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              disabled={copyStatus === "processing"}
              onClick={handleCopySvg}
              size="sm"
              variant="outline"
            >
              {copyStatus === "processing" && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              {copyStatus === "success" && <Check className="mr-1 h-3 w-3" />}
              {copyStatus === "idle" && <Copy className="mr-1 h-3 w-3" />}
              Copy
            </Button>

            <Button
              className="flex-1"
              disabled={downloadStatus === "processing"}
              onClick={handleDownloadSvg}
              size="sm"
              variant="outline"
            >
              {downloadStatus === "processing" && (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              )}
              {downloadStatus === "success" && (
                <Check className="mr-1 h-3 w-3" />
              )}
              {downloadStatus === "idle" && (
                <Download className="mr-1 h-3 w-3" />
              )}
              Download
            </Button>

            {onView && (
              <Button onClick={handleView} size="sm" variant="outline">
                <Eye className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
