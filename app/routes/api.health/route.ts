import { getHealthStatus } from "~/lib/server/png-converter.server";
import type { Route } from "./+types/route";

export const loader = async (_args: Route.LoaderArgs) => getHealthStatus();
