import type { Metadata } from "next";

import { Text } from "@/components/common/Text";

export const metadata: Metadata = {
  title: "내가 보낸 견적 요청",
  description: "내가 보낸 견적 요청 목록을 확인합니다.",
};

/** NOTE: 내가 보낸 견적 요청 페이지. 추후 수정이 필요 */
export default function EstimateRequestsPage() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-16">
      <Text as="h1" variant="2xl-semibold" className="text-text-primary">
        내가 보낸 견적 요청
      </Text>
      <Text variant="lg-regular" className="text-text-tertiary">
        페이지 준비 중입니다.
      </Text>
    </div>
  );
}
