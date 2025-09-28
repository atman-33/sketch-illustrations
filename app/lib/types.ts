/** biome-ignore-all lint/style/noMagicNumbers: ignore */
import { z } from "zod";

// Illustration schema
export const IllustrationSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.string().min(1, "Category is required"),
  license: z.literal("CC0"),
  svgPath: z.string().min(1, "SVG path is required"),
  createdAt: z.string().datetime().optional(),
  dimensions: z
    .object({
      width: z.number().positive(),
      height: z.number().positive(),
    })
    .optional(),
});

export type Illustration = z.infer<typeof IllustrationSchema>;

// Category schema
export const CategorySchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  illustrationCount: z.number().nonnegative().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// Search result schema
export const SearchResultSchema = z.object({
  illustrations: z.array(IllustrationSchema),
  total: z.number().nonnegative(),
  query: z.string(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// PNG conversion options
export const ConversionOptionsSchema = z.object({
  width: z.number().positive().max(2048),
  height: z.number().positive().max(2048),
  transparent: z.boolean().default(true),
  quality: z.number().min(0).max(100).default(90),
});

export type ConversionOptions = z.infer<typeof ConversionOptionsSchema>;

// Size presets
export const SizePresets = {
  icon: { width: 256, height: 256, label: "Icon (256x256)" },
  standard: { width: 512, height: 512, label: "Standard (512x512)" },
  large: { width: 1024, height: 1024, label: "Large (1024x1024)" },
} as const;

export type SizePreset = keyof typeof SizePresets;

// API response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Form schemas for search and filters
export const SearchFormSchema = z.object({
  query: z.string().min(1, "Search query is required").max(100),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type SearchForm = z.infer<typeof SearchFormSchema>;

// Copy/download action types
export type ActionFormat = "svg" | "png";
export type ActionStatus = "idle" | "processing" | "success" | "error";

export type ActionState = {
  status: ActionStatus;
  error?: string;
};
