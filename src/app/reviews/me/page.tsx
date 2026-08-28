import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import MyReviewsPageClient from "@/components/review/MyReviewsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews");

  return {
    title: t("metadata.myReviewsTitle"),
  };
}

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 페이지
// 2026.07.31 정슬기 - [수정] AuthGate를 페이지로 이동 (404가 layout 가드에 가로채지지 않도록)
export default async function MyReviewsPage() {
  const t = await getTranslations("reviews");

  return (
    <CustomerAuthGate loadingMessage={t("loading")}>
      <MyReviewsPageClient />
    </CustomerAuthGate>
  );
}
