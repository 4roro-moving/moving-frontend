import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import TermsPageClient from "@/components/terms/TermsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

// 2026.08.16 - [추가] 푸터에서 진입하는 공개 약관 페이지 (비회원 접근 가능)
export default function TermsPage() {
  return <TermsPageClient />;
}
