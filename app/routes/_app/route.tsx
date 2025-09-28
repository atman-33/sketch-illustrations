import { Outlet } from "react-router";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/routes/_app/components/header";
import type { Route } from "./+types/route";

export const loader = ({ context }: Route.LoaderArgs) => {
  const contactEmail = context.cloudflare.env.CONTACT_EMAIL;
  return {
    contactEmail,
  };
};

const AppLayout = ({ loaderData }: Route.ComponentProps) => (
  <>
    <Header />
    <Outlet />
    <Footer contactEmail={loaderData.contactEmail} />
  </>
);

export default AppLayout;
