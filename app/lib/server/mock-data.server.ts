import type { Category, Illustration, SearchResult } from "~/lib/types";

type PopularCategory = {
  slug: string;
  name: string;
  count: number;
};

export const mockCategories: Category[] = [
  {
    slug: "work",
    name: "Work & Business",
    description: "Professional illustrations for business contexts",
    icon: "briefcase",
    illustrationCount: 45,
  },
  {
    slug: "people",
    name: "People & Characters",
    description: "Human figures and character illustrations",
    icon: "users",
    illustrationCount: 32,
  },
  {
    slug: "objects",
    name: "Objects & Items",
    description: "Everyday objects and tools",
    icon: "package",
    illustrationCount: 28,
  },
  {
    slug: "nature",
    name: "Nature & Environment",
    description: "Plants, animals, and natural elements",
    icon: "leaf",
    illustrationCount: 21,
  },
  {
    slug: "technology",
    name: "Technology & Digital",
    description: "Devices, apps, and tech concepts",
    icon: "smartphone",
    illustrationCount: 38,
  },
  {
    slug: "education",
    name: "Education & Learning",
    description: "Academic and educational content",
    icon: "graduation-cap",
    illustrationCount: 25,
  },
];

export const mockIllustrations: Illustration[] = [
  {
    id: "work-laptop",
    title: "Laptop Computer",
    tags: ["computer", "laptop", "device", "work"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/laptop.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "people-developer",
    title: "Software Developer",
    tags: ["developer", "coding", "person", "work"],
    category: "people",
    license: "CC0",
    svgPath: "/illustrations/people/developer.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "objects-coffee",
    title: "Coffee Cup",
    tags: ["coffee", "drink", "work", "break"],
    category: "objects",
    license: "CC0",
    svgPath: "/illustrations/objects/coffee.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "work-meeting",
    title: "Team Meeting",
    tags: ["meeting", "team", "collaboration", "business"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/meeting.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "work-presentation",
    title: "Business Presentation",
    tags: ["presentation", "chart", "business", "analytics"],
    category: "work",
    license: "CC0",
    svgPath: "/illustrations/work/presentation.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "technology-vr-headset",
    title: "VR Headset",
    tags: ["vr", "technology", "device"],
    category: "technology",
    license: "CC0",
    svgPath: "/illustrations/technology/vr-headset.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "education-graduation",
    title: "Graduation Ceremony",
    tags: ["education", "graduation", "ceremony"],
    category: "education",
    license: "CC0",
    svgPath: "/illustrations/education/graduation.svg",
    dimensions: { width: 512, height: 512 },
  },
  {
    id: "nature-forest",
    title: "Forest Walk",
    tags: ["nature", "forest", "outdoors"],
    category: "nature",
    license: "CC0",
    svgPath: "/illustrations/nature/forest.svg",
    dimensions: { width: 512, height: 512 },
  },
];

const featuredIllustrationIds = [
  "work-laptop",
  "people-developer",
  "objects-coffee",
];

const isIllustration = (
  value: Illustration | undefined
): value is Illustration => Boolean(value);

export const featuredIllustrations: Illustration[] = featuredIllustrationIds
  .map((id) => mockIllustrations.find((illustration) => illustration.id === id))
  .filter(isIllustration);

const popularCategorySlugs = [
  "work",
  "people",
  "technology",
  "education",
] as const;

export const popularCategories: PopularCategory[] = popularCategorySlugs
  .map((slug) => {
    const category = mockCategories.find((item) => item.slug === slug);
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

export const getMockCategory = (slug: string): Category | undefined =>
  mockCategories.find((category) => category.slug === slug);

export const getAllIllustrations = (): Illustration[] => mockIllustrations;

export const getIllustrationsByCategory = (slug: string): Illustration[] =>
  mockIllustrations.filter((illustration) => illustration.category === slug);

export const getIllustrationById = (id: string): Illustration | undefined =>
  mockIllustrations.find((illustration) => illustration.id === id);

const matchesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query);

export const getMockSearchResults = (
  rawQuery: string,
  category?: string
): SearchResult => {
  const query = rawQuery.trim().toLowerCase();

  let results = mockIllustrations;
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
