/** biome-ignore-all lint/suspicious/useAwait: ignore */
/** biome-ignore-all lint/suspicious/noConsole: ignore */
/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import type {
  ApiResponse,
  Category,
  ConversionOptions,
  Illustration,
  SearchResult,
} from "./types";

// Base API configuration
const API_BASE_URL =
  typeof window !== "undefined" ? "" : "http://localhost:5173";

// Generic API fetch wrapper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data } as ApiResponse<T>;
  } catch (error) {
    console.error("API request failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Illustration API functions
export const illustrationApi = {
  /**
   * Get all categories
   */
  async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiRequest<Category[]>("/api/categories");
  },

  /**
   * Get illustrations by category
   */
  async getIllustrationsByCategory(
    slug: string
  ): Promise<ApiResponse<Illustration[]>> {
    return apiRequest<Illustration[]>(`/api/categories/${slug}/illustrations`);
  },

  /**
   * Search illustrations
   */
  async searchIllustrations(
    query: string,
    category?: string
  ): Promise<ApiResponse<SearchResult>> {
    const params = new URLSearchParams({ query });
    if (category) {
      params.set("category", category);
    }

    return apiRequest<SearchResult>(`/api/search?${params.toString()}`);
  },

  /**
   * Get single illustration by ID
   */
  async getIllustrationById(id: string): Promise<ApiResponse<Illustration>> {
    return apiRequest<Illustration>(`/api/illustrations/${id}`);
  },

  /**
   * Get all illustrations
   */
  async getAllIllustrations(): Promise<ApiResponse<Illustration[]>> {
    return apiRequest<Illustration[]>("/api/illustrations");
  },
};

// PNG conversion API
export const conversionApi = {
  /**
   * Convert SVG to PNG
   */
  async convertToPng(
    svgPath: string,
    options: ConversionOptions
  ): Promise<ApiResponse<Blob>> {
    try {
      const response = await fetch("/api/png-convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          svgPath,
          ...options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.status}`);
      }

      const blob = await response.blob();
      return { success: true, data: blob };
    } catch (error) {
      console.error("PNG conversion failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Conversion failed",
      };
    }
  },
};

// Copy/Download utilities
export const actionUtils = {
  /**
   * Copy content to clipboard
   */
  async copyToClipboard(
    content: string | Blob,
    format: "svg" | "png"
  ): Promise<boolean> {
    try {
      if (!navigator.clipboard) {
        console.warn("Clipboard API not available");
        return false;
      }

      if (format === "svg" && typeof content === "string") {
        await navigator.clipboard.writeText(content);
        return true;
      }

      if (format === "png" && content instanceof Blob) {
        const clipboardItem = new ClipboardItem({
          "image/png": content,
        });
        await navigator.clipboard.write([clipboardItem]);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Copy to clipboard failed:", error);
      return false;
    }
  },

  /**
   * Trigger file download
   */
  triggerDownload(content: Blob | string, filename: string): void {
    try {
      let blob: Blob;

      if (typeof content === "string") {
        blob = new Blob([content], { type: "image/svg+xml" });
      } else {
        blob = content;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL object
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Download failed:", error);
    }
  },

  /**
   * Get SVG content from path
   */
  async getSvgContent(svgPath: string): Promise<string | null> {
    try {
      const response = await fetch(svgPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error("Failed to get SVG content:", error);
      return null;
    }
  },

  /**
   * Generate filename for download
   */
  generateFilename(
    illustration: Illustration,
    format: "svg" | "png",
    size?: string
  ): string {
    const sanitizedTitle = illustration.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const sizeInfo = size ? `-${size}` : "";
    return `${sanitizedTitle}${sizeInfo}.${format}`;
  },
};

// Error handling utilities
export const errorUtils = {
  /**
   * Get user-friendly error message
   */
  getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "An unknown error occurred";
  },

  /**
   * Check if error is network related
   */
  isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return (
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch")
      );
    }
    return false;
  },
};
