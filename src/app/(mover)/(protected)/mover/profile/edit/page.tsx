import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MoverProfileEditView from "@/components/profile/MoverProfileEditView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return {
    title: t("editTitle"),
    description: t("editDescription"),
  };
}

const MoverProfileEditPage = () => {
  return <MoverProfileEditView />;
};

export default MoverProfileEditPage;
