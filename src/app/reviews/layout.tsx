import type { Metadata } from "next";
import type { ReactNode } from "react";

import ReviewsShell from "@/components/review/ReviewsShell";

export const metadata: Metadata = {
  title: "리뷰 관리",
  description: "작성 가능한 리뷰와 내가 작성한 리뷰를 관리합니다.",
};

// 2026.07.27 정슬기 - [추가] 리뷰 관리 레이아웃
export default function ReviewsLayout({ children }: { children: ReactNode }) {
  return <ReviewsShell>{children}</ReviewsShell>;
}
