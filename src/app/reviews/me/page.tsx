import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import MyReviewsPageClient from "@/components/review/MyReviewsPageClient";

export const metadata: Metadata = {
  title: "내가 작성한 리뷰",
};

// 2026.07.27 정슬기 - [추가] 내가 작성한 리뷰 페이지
// 2026.07.31 정슬기 - [수정] AuthGate를 페이지로 이동 (404가 layout 가드에 가로채지지 않도록)
export default function MyReviewsPage() {
  return (
    <CustomerAuthGate loadingMessage="리뷰를 불러오는 중입니다.">
      <MyReviewsPageClient />
    </CustomerAuthGate>
  );
}
