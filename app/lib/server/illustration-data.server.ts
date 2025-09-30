/** biome-ignore-all lint/style/useNamingConvention: ignore */
import type { Category, Illustration, SearchResult } from "~/lib/types";
import { CategorySchema, IllustrationSchema } from "~/lib/types";
import type { ReactRouterContext } from "~/utils/static-assets";
import { fetchStaticJson } from "~/utils/static-assets";

type RawIllustration = {
  id: string;
  title: string;
  tags: string[];
  category: string;
  license: string;
  svg_path: string;
  created_at?: string;
  dimensions?: {
    width: number;
    height: number;
  };
};

type RawCategory = {
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  illustration_count?: number;
};

type PopularCategory = {
  slug: string;
  name: string;
  count: number;
};

type AssetContext = ReactRouterContext | undefined;

const ILLUSTRATIONS_PATH = "/metadata/illustrations.json";
const CATEGORIES_PATH = "/metadata/categories.json";

let cachedIllustrations: Illustration[] | undefined;
let cachedCategories: Category[] | undefined;

const normalizeIllustration = (raw: RawIllustration): Illustration => {
  const normalized = {
    id: raw.id,
    title: raw.title,
    tags: raw.tags,
    category: raw.category,
    license: raw.license,
    svgPath: raw.svg_path,
    createdAt: raw.created_at,
    dimensions: raw.dimensions,
  };

  return IllustrationSchema.parse(normalized);
};

const normalizeCategory = (raw: RawCategory): Category => {
  const normalized = {
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    icon: raw.icon,
    illustrationCount: raw.illustration_count,
  };

  return CategorySchema.parse(normalized);
};

const isIllustration = (
  value: Illustration | undefined
): value is Illustration => value !== undefined;

export const loadIllustrations = async (
  context?: AssetContext,
  request?: Request
): Promise<Illustration[]> => {
  if (cachedIllustrations) {
    return cachedIllustrations;
  }

  const rawIllustrations = await fetchStaticJson<RawIllustration[]>(
    ILLUSTRATIONS_PATH,
    context,
    request
  );

  const parsed: Illustration[] = [];
  for (const raw of rawIllustrations) {
    parsed.push(normalizeIllustration(raw));
  }

  cachedIllustrations = parsed;
  return cachedIllustrations;
};

export const loadCategories = async (
  context?: AssetContext,
  request?: Request
): Promise<Category[]> => {
  if (cachedCategories) {
    return cachedCategories;
  }

  const rawCategories = await fetchStaticJson<RawCategory[]>(
    CATEGORIES_PATH,
    context,
    request
  );

  const parsed: Category[] = [];
  for (const raw of rawCategories) {
    parsed.push(normalizeCategory(raw));
  }

  cachedCategories = parsed;
  return cachedCategories;
};

export const featuredIllustrationIds = [
  "work-laptop",
  "people-developer",
  "objects-coffee",
] as const;

export const popularCategorySlugs = [
  "work",
  "people",
  "technology",
  "education",
] as const;

export const getAllIllustrations = async (
  context?: AssetContext,
  request?: Request
): Promise<Illustration[]> => loadIllustrations(context, request);

export const getIllustrationById = async (
  id: string,
  context?: AssetContext,
  request?: Request
): Promise<Illustration | undefined> => {
  const illustrations = await loadIllustrations(context, request);
  return illustrations.find((illustration) => illustration.id === id);
};

export const getIllustrationsByCategory = async (
  slug: string,
  context?: AssetContext,
  request?: Request
): Promise<Illustration[]> => {
  const illustrations = await loadIllustrations(context, request);
  return illustrations.filter((illustration) => illustration.category === slug);
};

export const getCategoryBySlug = async (
  slug: string,
  context?: AssetContext,
  request?: Request
): Promise<Category | undefined> => {
  const categories = await loadCategories(context, request);
  return categories.find((category) => category.slug === slug);
};

export const getFeaturedIllustrations = async (
  context?: AssetContext,
  request?: Request
): Promise<Illustration[]> => {
  const illustrations = await loadIllustrations(context, request);
  return featuredIllustrationIds
    .map((id) => illustrations.find((illustration) => illustration.id === id))
    .filter(isIllustration);
};

export const getPopularCategories = async (
  context?: AssetContext,
  request?: Request
): Promise<PopularCategory[]> => {
  const categories = await loadCategories(context, request);

  const popular: PopularCategory[] = [];
  for (const slug of popularCategorySlugs) {
    const category = categories.find((item) => item.slug === slug);
    if (!category) {
      continue;
    }
    popular.push({
      slug: category.slug,
      name: category.name,
      count: category.illustrationCount ?? 0,
    });
  }

  return popular;
};

const matchesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query);

export const searchIllustrations = async (
  rawQuery: string,
  category?: string,
  context?: AssetContext,
  request?: Request
): Promise<SearchResult> => {
  const query = rawQuery.trim().toLowerCase();

  let results = await loadIllustrations(context, request);
  if (category) {
    results = results.filter(
      (illustration) => illustration.category === category
    );
  }

  if (query) {
    results = results.filter(
      (illustration) =>
        matchesQuery(illustration.title, query) ||
        illustration.tags.some((tag) => matchesQuery(tag, query))
    );
  }

  return {
    illustrations: results,
    total: results.length,
    query: rawQuery,
  } satisfies SearchResult;
};

export const clearIllustrationCaches = () => {
  cachedIllustrations = undefined;
  cachedCategories = undefined;
};

export type { PopularCategory };
