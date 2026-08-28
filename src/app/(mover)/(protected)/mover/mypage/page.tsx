import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MoverMyPageView from "@/components/mover/mypage/MoverMyPageView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("profile");

  return { title: t("myPageTitle"), description: t("myPageDescription") };
}

const MoverMyPagePage = () => {
  return <MoverMyPageView />;
};

export default MoverMyPagePage;
