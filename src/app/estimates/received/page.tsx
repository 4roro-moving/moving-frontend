import type { Metadata } from "next";
import ReceivedEstimatesPageClient from "@/components/estimate/received/ReceivedEstimatesPageClient";

// 2026.07.24 정슬기 - [수정] Mock 페이지를 API 연동 클라이언트 페이지로 교체
export const metadata: Metadata = {
  // 2026.07.24 정슬기 - [추가] 받은 견적 목록 페이지 metadata
  title: "받았던 견적",
  description: "요청한 이사에 대해 받은 견적 목록을 확인하고 비교합니다.",
};

export default function ReceivedEstimatesPage() {
  return <ReceivedEstimatesPageClient />;
}
