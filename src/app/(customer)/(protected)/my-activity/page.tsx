import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import MyResidenceReviewPageView from "@/components/residence-review/MyResidenceReviewPageView";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("myActivity");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

const MyActivityPage = () => {
  return <MyResidenceReviewPageView />;
};

export default MyActivityPage;
