"use client";

import type { ReactNode } from "react";

import DetailBackButton from "@/components/common/DetailBackButton";
import { Text } from "@/components/common/Text";

interface EstimateDetailHeaderProps {
  title?: string;
  /** 있으면 제목 위 ghost 뒤로가기 표시 */
  // 2026.08.03 정슬기 - [추가]
  backFallbackHref?: string;
  /** Header 우측 액션 슬롯 (optional — 다른 상세 화면 무영향) */
  // 2026.08.03 정슬기 - [추가] optional actions
  actions?: ReactNode;
}

/**
 * 견적·기사 상세 공통 페이지 헤더
 * // 2026.08.03 정슬기 - [수정] optional 뒤로가기 — 제목 위 별도 행
 * // 2026.08.04 정슬기 - [수정] Desktop padding/타이포를 xl로 — Tablet 가로 스크롤 방지
 */
export default function EstimateDetailHeader({
  title = "견적 상세",
  backFallbackHref,
  actions,
}: EstimateDetailHeaderProps) {
  return (
    // 고정 높이 대신 padding으로 두 행(뒤로+제목)을 수용 — 과도한 확장 방지
    // 2026.08.04 정슬기 - [수정] Desktop padding/타이포를 xl로
    <header className="bg-background-default shadow-page-header px-margin-mobile md:px-margin-tablet xl:px-page-header-padding-x-desktop flex w-full max-w-full items-center justify-center overflow-x-hidden">
      <div className="max-w-container-desktop flex w-full min-w-0 flex-1 flex-col items-start gap-8 py-12 md:py-14 xl:py-16">
        {backFallbackHref ? <DetailBackButton fallbackHref={backFallbackHref} /> : null}

        <div className="flex w-full min-w-0 items-center justify-between gap-12">
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
      </div>
    </header>
  );
}
