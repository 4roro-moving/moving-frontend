import type { Metadata } from "next";

import { MoversPageClient } from "@/components/mover/MoversPageClient";

export const metadata: Metadata = {
  title: "기사님 찾기",
  description: "내 이사 조건에 맞는 기사님을 찾고, 평점과 경력, 확정 건수를 비교해 보세요.",
};

export default function MoversPage() {
  return <MoversPageClient />;
}
