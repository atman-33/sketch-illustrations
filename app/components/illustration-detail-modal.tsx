/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { Check, Copy, Download, Eye, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { useCopyDownload } from "~/lib/hooks/use-copy-download";
import type { ConversionOptions, Illustration, SizePreset } from "~/lib/types";
import { SizePresets } from "~/lib/types";

type IllustrationDetailModalProps = {
  illustration: Illustration | null;
  isOpen: boolean;
  onClose: () => void;
};

export function IllustrationDetailModal({
  illustration,
  isOpen,
  onClose,
}: IllustrationDetailModalProps) {
  // Selected output format
  const [selectedFormat, setSelectedFormat] = useState<"svg" | "png">("svg");

  // Selected size preset (used when PNG is chosen)
  const [selectedSize, setSelectedSize] = useState<SizePreset>("standard");

  // Guard early if modal is closed or data not ready
  if (!illustration) {
    return null;
  }

  // Hook for copy/download actions
  const {
    copyStatus,
    downloadStatus,
    copySvg,
    copyPng,
    downloadSvg,
    downloadPng,
    isProcessing,
    // biome-ignore lint/correctness/useHookAtTopLevel: ignore
  } = useCopyDownload(illustration, {
    onSuccess: (action, format) => {
      const actionText = action === "copy" ? "copied" : "downloaded";
      toast.success(`${format.toUpperCase()} ${actionText} successfully!`);
    },
    onError: (action, format, error) => {
      toast.error(`Failed to ${action} ${format.toUpperCase()}: ${error}`);
    },
  });

  // Build conversion options for PNG export
  // biome-ignore lint/correctness/useHookAtTopLevel: ignore
  const conversionOptions: ConversionOptions = useMemo(() => {
    if (selectedFormat !== "png") {
      // Not used for SVG, but return a sensible default
      // biome-ignore lint/suspicious/noExplicitAny: ignore
      return { width: 512, height: 512, transparent: true } as any;
    }

    const preset = SizePresets[selectedSize];
    return {
      width: preset.width,
      height: preset.height,
      transparent: true,
    };
  }, [selectedFormat, selectedSize]);

  // Compute a human-readable size label for the current selection
  // biome-ignore lint/correctness/useHookAtTopLevel: ignore
  const currentSizeLabel = useMemo(() => {
    if (selectedFormat === "svg") {
      return "";
    }
    const preset = SizePresets[selectedSize];
    return `${preset.width}x${preset.height}`;
  }, [selectedFormat, selectedSize]);

  // Copy action according to the selected format/size
  const handleCopy = async () => {
    if (selectedFormat === "svg") {
      await copySvg();
    } else {
      await copyPng(conversionOptions);
    }
  };

  // Download action according to the selected format/size
  const handleDownload = async () => {
    if (selectedFormat === "svg") {
      await downloadSvg();
    } else {
      await downloadPng(conversionOptions);
    }
  };

  // NOTE: shadcn/ui Dialog expects (open: boolean) => void
  // We call onClose() only when it becomes false.
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {illustration.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-50 p-8">
              {/* Show the SVG as a preview (renders crisply at any size) */}
              {/** biome-ignore lint/nursery/useImageSize: ignore */}
              {/** biome-ignore lint/performance/noImgElement: ignore */}
              <img
                alt={illustration.title}
                className="max-h-full max-w-full object-contain"
                loading="lazy"
                src={illustration.svgPath}
              />
            </div>

            {/* Illustration Info */}
            <div className="space-y-3">
              <div>
                <Label className="font-medium text-muted-foreground text-sm">
                  Category
                </Label>
                <div className="mt-1">
                  <Badge variant="secondary">{illustration.category}</Badge>
                </div>
              </div>

              <div>
                <Label className="font-medium text-muted-foreground text-sm">
                  Tags
                </Label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {illustration.tags.map((tag) => (
                    <Badge className="text-xs" key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="font-medium text-muted-foreground text-sm">
                  License
                </Label>
                <div className="mt-1">
                  <Badge variant="default">CC0 - Free to use</Badge>
                </div>
              </div>

              {illustration.dimensions && (
                <div>
                  <Label className="font-medium text-muted-foreground text-sm">
                    Original Size
                  </Label>
                  <p className="mt-1 text-sm">
                    {illustration.dimensions.width} ×{" "}
                    {illustration.dimensions.height} px
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-6 p-6">
                <div>
                  <Label className="font-semibold text-base">
                    Download Options
                  </Label>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Choose your preferred format and size
                  </p>
                </div>

                {/* Format Selection */}
                <div className="space-y-3">
                  <Label className="font-medium text-sm">Format</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      aria-pressed={selectedFormat === "svg"}
                      className="justify-start"
                      onClick={() => setSelectedFormat("svg")}
                      type="button"
                      variant={selectedFormat === "svg" ? "default" : "outline"}
                    >
                      SVG (Vector)
                    </Button>
                    <Button
                      aria-pressed={selectedFormat === "png"}
                      className="justify-start"
                      onClick={() => setSelectedFormat("png")}
                      type="button"
                      variant={selectedFormat === "png" ? "default" : "outline"}
                    >
                      PNG (Raster)
                    </Button>
                  </div>
                </div>

                {/* Size Selection (only for PNG) */}
                {selectedFormat === "png" && (
                  <div className="space-y-3">
                    <Label className="font-medium text-sm">Size</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(SizePresets).map(([key, preset]) => (
                        <Button
                          aria-pressed={selectedSize === (key as SizePreset)}
                          className="justify-between text-sm"
                          key={key}
                          onClick={() => setSelectedSize(key as SizePreset)}
                          type="button"
                          variant={
                            selectedSize === (key as SizePreset)
                              ? "default"
                              : "outline"
                          }
                        >
                          <span>{preset.label}</span>
                          <span className="text-muted-foreground">
                            {preset.width}×{preset.height}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Selection Summary */}
                <div className="rounded-lg bg-muted p-3">
                  <p className="text-sm">
                    <span className="font-medium">Selected:</span>{" "}
                    {selectedFormat.toUpperCase()}
                    {selectedFormat === "png" && ` • ${currentSizeLabel}px`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    className="w-full"
                    disabled={isProcessing}
                    onClick={handleCopy}
                    size="lg"
                    type="button"
                  >
                    {copyStatus === "processing" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {copyStatus === "success" && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {copyStatus === "idle" && <Copy className="mr-2 h-4 w-4" />}
                    Copy to Clipboard
                  </Button>

                  <Button
                    className="w-full"
                    disabled={isProcessing}
                    onClick={handleDownload}
                    size="lg"
                    type="button"
                    variant="outline"
                  >
                    {downloadStatus === "processing" && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {downloadStatus === "success" && (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {downloadStatus === "idle" && (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download File
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Usage Information */}
            <Card>
              <CardContent className="space-y-4 p-6">
                <div>
                  <Label className="font-semibold text-base">
                    Usage Information
                  </Label>
                </div>

                <div className="space-y-3 text-muted-foreground text-sm">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Free for commercial and personal use</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>No attribution required (CC0 license)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    <span>Modify and redistribute freely</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    <span>
                      Perfect for blogs, presentations, and design tools
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
