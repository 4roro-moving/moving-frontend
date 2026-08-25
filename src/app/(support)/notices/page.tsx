import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import NoticePageClient from "@/components/notice/NoticePageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("supportNotice");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default function NoticesPage() {
  return <NoticePageClient />;
}
