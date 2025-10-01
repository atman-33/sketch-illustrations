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

const AppLayout = ({ loaderData }: Route.ComponentProps) => (
  <>
    <Header />
    <Outlet />
    <Footer githubIssuesUrl={loaderData.githubIssuesUrl} />
  </>
);

export default AppLayout;
