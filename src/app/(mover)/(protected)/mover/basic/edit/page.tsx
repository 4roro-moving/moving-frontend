import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MoverBasicInfoEditView from "@/components/profile/MoverBasicInfoEditView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return { title: t("basicInfoTitle"), description: t("basicInfoDescription") };
}

const MoverBasicInfoEditPage = () => {
  return <MoverBasicInfoEditView />;
};

export default MoverBasicInfoEditPage;
