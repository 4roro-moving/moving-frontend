import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MoverProfileCreateView from "@/components/profile/MoverProfileCreateView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return {
    title: t("moverCreateTitle"),
    description: t("createDescription"),
  };
}

const MoverProfilePage = () => {
  return <MoverProfileCreateView />;
};

export default MoverProfilePage;
