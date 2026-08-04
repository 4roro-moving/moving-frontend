import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";

interface EstimateDetailHeaderProps {
  title?: string;
  /** Header 우측 액션 슬롯 (보낸 요청 취소 등). 다른 상세에는 영향 없음 */
  // 2026.08.03 정슬기 - [추가] optional actions
  actions?: ReactNode;
}

export default function EstimateDetailHeader({
  title = "견적 상세",
  actions,
}: EstimateDetailHeaderProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 페이지 헤더 높이·여백
    // 2026.08.04 정슬기 - [수정] Desktop padding/타이포를 xl로 — Tablet(lg) 과다 padding·가로 스크롤 방지
    <header className="bg-background-default px-margin-mobile md:px-margin-tablet h-page-header-height-mobile md:h-page-header-height-tablet xl:h-page-header-height-desktop xl:px-page-header-padding-x-desktop flex w-full max-w-full items-center justify-center overflow-x-hidden shadow-[0_2px_10px_0_rgba(248,248,248,0.1)]">
      <div className="max-w-container-desktop flex w-full min-w-0 flex-1 items-center justify-between gap-12">
        <h1 className="text-text-primary min-w-0">
          <Text as="span" variant="2lg-semibold" className="xl:hidden">
            {title}
          </Text>
          <Text as="span" variant="2xl-semibold" className="hidden xl:inline">
            {title}
          </Text>
        </h1>
        {actions ? <div className="flex shrink-0 items-center">{actions}</div> : null}
      </div>
    </header>
  );
}
