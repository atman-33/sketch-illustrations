import {
  getAllIllustrations,
  getIllustrationsByCategory,
} from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  if (category) {
    return await getIllustrationsByCategory(category, context, request);
  }

  return await getAllIllustrations(context, request);
};
