import { getCategoriesWithCounts } from "~/lib/server/illustration-data.server";
import type { Route } from "./+types/route";

export const loader = async ({ context, request }: Route.LoaderArgs) =>
  getCategoriesWithCounts(context, request);
