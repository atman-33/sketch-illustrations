import { HTTP_STATUS } from "~/lib/constants/http-status";
import { getIllustrationById } from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({
  context,
  params,
  request,
}: Route.LoaderArgs) => {
  const { id } = params;

  if (!id) {
    throw new Response("Illustration not found", {
      status: HTTP_STATUS.notFound,
    });
  }

  const illustration = await getIllustrationById(id, context, request);
  if (!illustration) {
    throw new Response("Illustration not found", {
      status: HTTP_STATUS.notFound,
    });
  }

  return illustration;
};
