import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import InquiryPageClient from "@/components/inquiry/InquiryPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("supportInquiry");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default function InquiriesPage() {
  return <InquiryPageClient />;
}
