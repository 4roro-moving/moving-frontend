import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import FaqPageClient from "@/components/faq/FaqPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("supportFaq");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default function FaqPage() {
  return <FaqPageClient />;
}
