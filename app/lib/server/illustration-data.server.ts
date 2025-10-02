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
  popular?: boolean;
};

type PopularCategory = {
  slug: string;
  name: string;
  count: number;
};

type AssetContext = ReactRouterContext | undefined;

const ILLUSTRATIONS_PATH = "/metadata/illustrations.json";
const CATEGORIES_PATH = "/metadata/categories.json";
const FEATURED_ILLUSTRATION_LIMIT = 16;

let cachedIllustrations: Illustration[] | undefined;
let cachedCategories: Category[] | undefined;
let cachedPopularCategorySlugs: string[] | undefined;

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

const normalizeCategory = (raw: RawCategory): Category =>
  CategorySchema.parse({
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    icon: raw.icon,
  });

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

  cachedPopularCategorySlugs = rawCategories
    .filter((raw) => raw.popular)
    .map((raw) => raw.slug);

  const parsed: Category[] = [];
  for (const raw of rawCategories) {
    parsed.push(normalizeCategory(raw));
  }

  cachedCategories = parsed;
  return cachedCategories;
};

const buildCategoryCountMap = (
  illustrations: Illustration[]
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const illustration of illustrations) {
    const current = counts.get(illustration.category) ?? 0;
    counts.set(illustration.category, current + 1);
  }
  return counts;
};

const withIllustrationCounts = (
  categories: Category[],
  counts: Map<string, number>
): Category[] =>
  categories.map((category) => ({
    ...category,
    illustrationCount: counts.get(category.slug) ?? 0,
  }));

export const getCategoriesWithCounts = async (
  context?: AssetContext,
  request?: Request
): Promise<Category[]> => {
  const [categories, illustrations] = await Promise.all([
    loadCategories(context, request),
    loadIllustrations(context, request),
  ]);

  const counts = buildCategoryCountMap(illustrations);
  return withIllustrationCounts(categories, counts);
};

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
  const categories = await getCategoriesWithCounts(context, request);
  return categories.find((category) => category.slug === slug);
};

export const getFeaturedIllustrations = async (
  context?: AssetContext,
  request?: Request
): Promise<Illustration[]> => {
  const illustrations = await loadIllustrations(context, request);
  const sorted = [...illustrations].sort((first, second) => {
    const a = first.createdAt ? new Date(first.createdAt).getTime() : 0;
    const b = second.createdAt ? new Date(second.createdAt).getTime() : 0;
    return b - a;
  });

  return sorted.slice(0, FEATURED_ILLUSTRATION_LIMIT).filter(isIllustration);
};

export const getPopularCategories = async (
  context?: AssetContext,
  request?: Request
): Promise<PopularCategory[]> => {
  const categories = await getCategoriesWithCounts(context, request);

  const popularSlugs = cachedPopularCategorySlugs ?? [];

  return popularSlugs
    .map((slug) => {
      const category = categories.find((item) => item.slug === slug);
      if (!category) {
        return null;
      }
      return {
        slug: category.slug,
        name: category.name,
        count: category.illustrationCount ?? 0,
      } satisfies PopularCategory;
    })
    .filter(Boolean) as PopularCategory[];
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
  cachedPopularCategorySlugs = undefined;
};

export type { PopularCategory };
