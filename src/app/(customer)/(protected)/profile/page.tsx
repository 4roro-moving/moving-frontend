import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CustomerProfileCreateView from "@/components/profile/CustomerProfileCreateView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return {
    title: t("createTitle"),
    description: t("createDescription"),
  };
}

const CustomerProfilePage = () => {
  return <CustomerProfileCreateView />;
};

export default CustomerProfilePage;
