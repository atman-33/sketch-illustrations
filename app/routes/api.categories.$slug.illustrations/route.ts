import { HTTP_STATUS } from "~/lib/constants/http-status";
import {
  getCategoryBySlug,
  getIllustrationsByCategory,
} from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({
  context,
  params,
  request,
}: Route.LoaderArgs) => {
  const { slug } = params;

  if (!slug) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  const category = await getCategoryBySlug(slug, context, request);
  if (!category) {
    throw new Response("Category not found", { status: HTTP_STATUS.notFound });
  }

  return getIllustrationsByCategory(slug, context, request);
};
