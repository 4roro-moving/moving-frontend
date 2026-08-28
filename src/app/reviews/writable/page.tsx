import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import WritableReviewsPageClient from "@/components/review/WritableReviewsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews");

  return {
    title: t("metadata.writableTitle"),
  };
}

export default async function WritableReviewsPage() {
  const t = await getTranslations("reviews");

  return (
    <CustomerAuthGate loadingMessage={t("loading")}>
      <WritableReviewsPageClient />
    </CustomerAuthGate>
  );
}
