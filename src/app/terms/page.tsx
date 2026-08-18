import type { Metadata } from "next";

import TermsPageClient from "@/components/terms/TermsPageClient";

export const metadata: Metadata = {
  title: "약관 및 정책",
  description: "무빙 서비스 이용에 적용되는 약관과 정책을 확인할 수 있습니다.",
};

// 2026.08.16 - [추가] 푸터에서 진입하는 공개 약관 페이지 (비회원 접근 가능)
export default function TermsPage() {
  return <TermsPageClient />;
}
