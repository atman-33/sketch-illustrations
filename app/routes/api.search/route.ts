import { searchIllustrations } from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const query =
    url.searchParams.get("query") || url.searchParams.get("q") || "";
  const category = url.searchParams.get("category") || undefined;

  return await searchIllustrations(query, category, context, request);
};
