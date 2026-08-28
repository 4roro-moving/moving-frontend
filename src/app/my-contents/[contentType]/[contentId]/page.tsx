import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import MyContentDetailPageClient from "@/components/my-content/MyContentDetailPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("myContent");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default async function MyContentDetailPage() {
  const t = await getTranslations("myContent");

  return (
    <CustomerAuthGate loadingMessage={t("loading")}>
      <MyContentDetailPageClient />
    </CustomerAuthGate>
  );
}
