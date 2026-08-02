import type { Metadata } from "next";

import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "무빙",
  description: "무빙은 여러 견적을 한눈에 비교해 이사업체 선정 과정을 간편하게 바꿔드려요",
};

/**
 * 홈(/) — 랜딩 (Desktop / Tablet / Mobile)
 * // 2026.07.31 정슬기 - [수정] 임시 화면 → 랜딩 페이지
 * // 2026.08.01 정슬기 - [수정] 반응형 QA
 */
export default function Home() {
  return <LandingPage />;
}
