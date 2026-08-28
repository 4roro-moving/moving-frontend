import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import ReviewsShell from "@/components/review/ReviewsShell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("reviews");

  return {
    title: t("metadata.manageTitle"),
    description: t("metadata.manageDescription"),
  };
}

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 페이지
export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <ReviewsShell>{children}</ReviewsShell>;
}
