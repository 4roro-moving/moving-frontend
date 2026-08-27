import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import LandingPage from "@/components/landing/LandingPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

/**
 * 홈(/) — 랜딩 (Desktop / Tablet / Mobile)
 * // 2026.07.31 정슬기 - [수정] 임시 화면 → 랜딩 페이지
 * // 2026.08.01 정슬기 - [수정] 반응형 QA
 */
export default function Home() {
  return <LandingPage />;
}
