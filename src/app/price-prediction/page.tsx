import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PricePredictionPageClient from "@/components/price-prediction/PricePredictionPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pricePrediction");

  return {
    title: t("metadataTitle"),
    description: t("metadataDescription"),
  };
}

export default function PricePredictionPage() {
  return (
    <main className="bg-background-subtle min-h-screen px-24 py-40 md:px-40 md:py-64">
      <PricePredictionPageClient />
    </main>
  );
}
