import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MoverRecommendationMapPage } from "@/components/mover/map/MoverRecommendationMapPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("moverRecommendation");

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

export default function MoversMapPage() {
  return <MoverRecommendationMapPage />;
}
