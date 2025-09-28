import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { createRequestHandler } from "react-router";
// biome-ignore lint/performance/noNamespaceImport: ignore
import * as schema from "../database/schema";
import { handleHealthCheck, handlePngConversion } from "./png-converter";

declare module "react-router" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: ignore
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
    db: DrizzleD1Database<typeof schema>;
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  // biome-ignore lint/suspicious/useAwait: ignore
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle Worker-specific API routes
    if (pathname.startsWith("/api/")) {
      // biome-ignore lint/style/useDefaultSwitchClause: ignore
      switch (pathname) {
        case "/api/png-convert":
          return handlePngConversion(request);

        case "/api/health":
          return handleHealthCheck();

        case "/api/illustrations":
          return handleGetIllustrations(request);

        case "/api/categories":
          return handleGetCategories(request);

        case "/api/search":
          return handleSearch(request);
      }
    }

    // For all other routes, use the React Router handler
    const db = drizzle(env.DB, { schema });

    return requestHandler(request, {
      cloudflare: { env, ctx },
      db,
    });
  },
} satisfies ExportedHandler<Env>;

// Mock API handlers (to be replaced with real implementations)
// biome-ignore lint/suspicious/useAwait: ignore
async function handleGetIllustrations(_request: Request): Promise<Response> {
  const mockIllustrations = [
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
  ];

  return new Response(JSON.stringify(mockIllustrations), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// biome-ignore lint/suspicious/useAwait: ignore
async function handleGetCategories(_request: Request): Promise<Response> {
  const mockCategories = [
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
  ];

  return new Response(JSON.stringify(mockCategories), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// biome-ignore lint/suspicious/useAwait: ignore
async function handleSearch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  // Mock search results
  const mockResults = {
    illustrations: [
      {
        id: "work-laptop",
        title: "Laptop Computer",
        tags: ["computer", "laptop", "device", "work"],
        category: "work",
        license: "CC0",
        svgPath: "/illustrations/work/laptop.svg",
        dimensions: { width: 512, height: 512 },
      },
    ],
    total: 1,
    query,
  };

  return new Response(JSON.stringify(mockResults), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
