import { Outlet } from "react-router";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/routes/_app/components/header";
import type { Route } from "./+types/route";

export const loader = ({ context }: Route.LoaderArgs) => {
  const githubIssuesUrl = context.cloudflare.env.GITHUB_ISSUES_URL;
  return {
    githubIssuesUrl,
  };
};

export const meta: Route.MetaFunction = ({ matches }) => {
  const rootMatch = matches.find((match) => match?.id === "root");
  // biome-ignore lint/style/useNamingConvention: ignore
  const rootData = rootMatch?.data as { baseURL?: string } | undefined;
  const baseUrl = typeof rootData?.baseURL === "string" ? rootData.baseURL : "";
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;
  const siteUrl = normalizedBaseUrl ? `${normalizedBaseUrl}/` : "/";
  const title = "Sketch Illustrations - Instant CC0 Sketch Library";
  const description =
    "Browse featured sets, quick categories, and hero highlights to copy CC0 sketch illustrations in seconds.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: siteUrl },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
};

const AppLayout = ({ loaderData }: Route.ComponentProps) => (
  <>
    <Header />
    <Outlet />
    <Footer githubIssuesUrl={loaderData.githubIssuesUrl} />
  </>
);

export default AppLayout;
