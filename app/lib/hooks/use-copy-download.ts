/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { actionUtils, conversionApi } from "~/lib/api";
import type {
  ActionStatus,
  ConversionOptions,
  Illustration,
} from "~/lib/types";

export type UseCopyDownloadOptions = {
  onSuccess?: (action: "copy" | "download", format: "svg" | "png") => void;
  onError?: (
    action: "copy" | "download",
    format: "svg" | "png",
    error: string
  ) => void;
};

export type UseCopyDownloadReturn = {
  copyStatus: ActionStatus;
  downloadStatus: ActionStatus;
  copySvg: () => Promise<void>;
  copyPng: (options?: ConversionOptions) => Promise<void>;
  downloadSvg: () => Promise<void>;
  downloadPng: (options?: ConversionOptions) => Promise<void>;
  isProcessing: boolean;
};

/**
 * Custom hook for handling copy and download functionality
 */
export function useCopyDownload(
  illustration: Illustration,
  options: UseCopyDownloadOptions = {}
): UseCopyDownloadReturn {
  const [copyStatus, setCopyStatus] = useState<ActionStatus>("idle");
  const [downloadStatus, setDownloadStatus] = useState<ActionStatus>("idle");

  const { onSuccess, onError } = options;

  const copySvg = useCallback(async () => {
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
        onSuccess?.("copy", "svg");
        setTimeout(() => setCopyStatus("idle"), 2000);
      } else {
        // Fallback to download
        const filename = actionUtils.generateFilename(illustration, "svg");
        actionUtils.triggerDownload(svgContent, filename);
        setCopyStatus("idle");
        toast.info("SVG downloaded (clipboard not available)");
        onSuccess?.("download", "svg");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to copy SVG";
      setCopyStatus("error");
      toast.error(errorMessage);
      onError?.("copy", "svg", errorMessage);
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  }, [illustration, onSuccess, onError]);

  const copyPng = useCallback(
    async (conversionOptions?: ConversionOptions) => {
      setCopyStatus("processing");
      try {
        // biome-ignore lint/nursery/noShadow: ignore
        const options = conversionOptions || {
          width: 512,
          height: 512,
          transparent: true,
        };
        const response = await conversionApi.convertToPng(
          illustration.svgPath,
          // biome-ignore lint/suspicious/noExplicitAny: ignore
          options as any
        );

        if (!(response.success && response.data)) {
          throw new Error(response.error || "PNG conversion failed");
        }

        const success = await actionUtils.copyToClipboard(response.data, "png");
        if (success) {
          setCopyStatus("success");
          toast.success("PNG copied to clipboard!");
          onSuccess?.("copy", "png");
          setTimeout(() => setCopyStatus("idle"), 2000);
        } else {
          // Fallback to download
          const filename = actionUtils.generateFilename(
            illustration,
            "png",
            `${options.width}x${options.height}`
          );
          actionUtils.triggerDownload(response.data, filename);
          setCopyStatus("idle");
          toast.info("PNG downloaded (clipboard not available)");
          onSuccess?.("download", "png");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to copy PNG";
        setCopyStatus("error");
        toast.error(errorMessage);
        onError?.("copy", "png", errorMessage);
        setTimeout(() => setCopyStatus("idle"), 2000);
      }
    },
    [illustration, onSuccess, onError]
  );

  const downloadSvg = useCallback(async () => {
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
      onSuccess?.("download", "svg");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to download SVG";
      setDownloadStatus("error");
      toast.error(errorMessage);
      onError?.("download", "svg", errorMessage);
      setTimeout(() => setDownloadStatus("idle"), 2000);
    }
  }, [illustration, onSuccess, onError]);

  const downloadPng = useCallback(
    async (conversionOptions?: ConversionOptions) => {
      setDownloadStatus("processing");
      try {
        // biome-ignore lint/nursery/noShadow: ignore
        const options = conversionOptions || {
          width: 512,
          height: 512,
          transparent: true,
        };
        const response = await conversionApi.convertToPng(
          illustration.svgPath,
          // biome-ignore lint/suspicious/noExplicitAny: ignore
          options as any
        );

        if (!(response.success && response.data)) {
          throw new Error(response.error || "PNG conversion failed");
        }

        const filename = actionUtils.generateFilename(
          illustration,
          "png",
          `${options.width}x${options.height}`
        );
        actionUtils.triggerDownload(response.data, filename);
        setDownloadStatus("success");
        toast.success("PNG downloaded!");
        onSuccess?.("download", "png");
        setTimeout(() => setDownloadStatus("idle"), 2000);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to download PNG";
        setDownloadStatus("error");
        toast.error(errorMessage);
        onError?.("download", "png", errorMessage);
        setTimeout(() => setDownloadStatus("idle"), 2000);
      }
    },
    [illustration, onSuccess, onError]
  );

  const isProcessing =
    copyStatus === "processing" || downloadStatus === "processing";

  return {
    copyStatus,
    downloadStatus,
    copySvg,
    copyPng,
    downloadSvg,
    downloadPng,
    isProcessing,
  };
}

/**
 * Hook for batch operations on multiple illustrations
 */
export function useBatchCopyDownload(illustrations: Illustration[]) {
  const [batchStatus, setBatchStatus] = useState<ActionStatus>("idle");
  const [completedCount, setCompletedCount] = useState(0);

  const downloadAllSvg = useCallback(async () => {
    setBatchStatus("processing");
    setCompletedCount(0);

    try {
      for (let i = 0; i < illustrations.length; i++) {
        const illustration = illustrations[i];
        const svgContent = await actionUtils.getSvgContent(
          illustration.svgPath
        );

        if (svgContent) {
          const filename = actionUtils.generateFilename(illustration, "svg");
          actionUtils.triggerDownload(svgContent, filename);
          setCompletedCount(i + 1);

          // Small delay between downloads to prevent browser blocking
          if (i < illustrations.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
        }
      }

      setBatchStatus("success");
      toast.success(`Downloaded ${illustrations.length} SVG files!`);
      setTimeout(() => setBatchStatus("idle"), 2000);
    } catch (_error) {
      setBatchStatus("error");
      toast.error("Batch download failed");
      setTimeout(() => setBatchStatus("idle"), 2000);
    }
  }, [illustrations]);

  const progress =
    illustrations.length > 0
      ? (completedCount / illustrations.length) * 100
      : 0;

  return {
    batchStatus,
    downloadAllSvg,
    progress,
    completedCount,
    totalCount: illustrations.length,
  };
}

/**
 * Hook for clipboard feature detection and fallback handling
 */
export function useClipboardSupport() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSecureContext, setIsSecureContext] = useState(false);

  // Check clipboard support on mount
  useState(() => {
    if (typeof window !== "undefined") {
      setIsSecureContext(window.isSecureContext);
      setIsSupported(
        window.isSecureContext &&
          "navigator" in window &&
          "clipboard" in navigator &&
          "write" in navigator.clipboard
      );
    }
  });

  const getUnsupportedReason = useCallback(() => {
    if (typeof window === "undefined") {
      return "Server-side rendering";
    }
    if (!isSecureContext) {
      return "Requires HTTPS";
    }
    if (!("navigator" in window)) {
      return "Navigator not available";
    }
    if (!("clipboard" in navigator)) {
      return "Clipboard API not available";
    }
    if (!("write" in navigator.clipboard)) {
      return "Clipboard write not available";
    }
    return "Unknown reason";
  }, [isSecureContext]);

  return {
    isSupported,
    isSecureContext,
    getUnsupportedReason,
  };
}
