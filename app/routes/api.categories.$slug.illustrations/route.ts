import { HTTP_STATUS } from "~/lib/constants/http-status";
import {
  getIllustrationsByCategory,
  getMockCategory,
} from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { slug } = params;

  if (!slug) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  const category = getMockCategory(slug);
  if (!category) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  return getIllustrationsByCategory(slug);
};
