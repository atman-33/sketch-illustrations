import {
  getAllIllustrations,
  getIllustrationsByCategory,
} from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  return category
    ? getIllustrationsByCategory(category)
    : getAllIllustrations();
};
