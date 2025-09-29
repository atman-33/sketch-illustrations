import type { Route } from "./+types/route";

export const loader = async (_args: Route.LoaderArgs) => ({
  status: "healthy" as const,
  timestamp: new Date().toISOString(),
});
