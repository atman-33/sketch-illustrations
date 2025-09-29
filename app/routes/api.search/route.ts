import { getMockSearchResults } from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query =
    url.searchParams.get("query") || url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || undefined;

  return getMockSearchResults(query, category);
};
