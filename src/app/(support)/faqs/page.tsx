import type { Metadata } from "next";

import FaqPageClient from "@/components/faq/FaqPageClient";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 무빙",
  description: "무빙 서비스 이용 중 자주 묻는 질문과 답변을 확인할 수 있습니다.",
};

export default function FaqPage() {
  return <FaqPageClient />;
}
