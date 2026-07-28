import type { Metadata } from "next";

import WritableReviewsPageClient from "@/components/review/WritableReviewsPageClient";

export const metadata: Metadata = {
  title: "작성 가능한 리뷰",
};

// 2026.07.27 정슬기 - [추가] 작성 가능한 리뷰 페이지
export default function WritableReviewsPage() {
  return <WritableReviewsPageClient />;
}
