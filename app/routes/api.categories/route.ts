import { mockCategories } from "~/lib/server/mock-data.server";
import type { Route } from "./+types/route";

export const loader = async (_args: Route.LoaderArgs) => mockCategories;
