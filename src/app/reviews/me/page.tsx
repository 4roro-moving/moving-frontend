import type { Metadata } from "next";

import MyReviewsPageClient from "@/components/review/MyReviewsPageClient";

export const metadata: Metadata = {
  title: "내가 작성한 리뷰",
};

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 페이지
export default function MyReviewsPage() {
  return <MyReviewsPageClient />;
}
