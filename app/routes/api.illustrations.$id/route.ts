import { HTTP_STATUS } from "~/lib/constants/http-status";
import { getIllustrationById } from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

// biome-ignore lint/suspicious/useAwait: ignore
export const loader = async ({ params }: Route.LoaderArgs) => {
  const { id } = params;

  if (!id) {
    throw new Response("Illustration not found", {
      status: HTTP_STATUS.notFound,
    });
  }

  const illustration = getIllustrationById(id);
  if (!illustration) {
    throw new Response("Illustration not found", {
      status: HTTP_STATUS.notFound,
    });
  }

  return illustration;
};
