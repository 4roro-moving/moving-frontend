import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CustomerProfileEditView from "@/components/profile/CustomerProfileEditView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return {
    title: t("editTitle"),
    description: t("editDescription"),
  };
}

const CustomerProfileEditPage = () => {
  return <CustomerProfileEditView />;
};

export default CustomerProfileEditPage;
