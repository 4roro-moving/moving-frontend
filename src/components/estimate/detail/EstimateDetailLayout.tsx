import type { ReactNode } from "react";

import DetailHeroBanner from "@/components/common/DetailHeroBanner";
import { PageHeader } from "@/components/common/PageHeader";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { cn } from "@/lib/utils/cn";

/**
 * 받은 견적·견적요청 상세 공통 레이아웃 프리셋 (tokens: pb-37-5 / w-210 / w-80)
 * Desktop 좌우 분할은 xl(1280+) — lg(1024)에서 고정폭 1200이 Tablet 가로 스크롤을 만들던 문제 방지
 * // 2026.07.30 정슬기 - [추가] 호출부 임의 px·클래스 중복 제거
 * // 2026.08.04 정슬기 - [수정] lg → xl (Tablet 가로 스크롤)
 */
export const ESTIMATE_DETAIL_LAYOUT_CLASSES = {
  contentClassName: "pt-24 pb-64 md:pt-28 md:pb-80 xl:pb-37-5",
  // 본문+aside 블록을 컨테이너 안에서 가운데로 모아 좌측 치우침을 줄인다
  rowClassName: "gap-32 md:gap-40 xl:justify-center",
  // Desktop 본문 840 + aside 320 + gap 40 = 1200 (container)
  // overflow-clip 제거 — focus ring이 aside 경계에서 잘리지 않도록 폭만으로 제한
  mainClassName: "gap-24 md:gap-30 xl:w-210 xl:shrink-0",
  asideClassName: "gap-28 md:gap-40 xl:w-80 xl:shrink-0",
} as const;

interface EstimateDetailLayoutProps {
  title?: string;
  heroImageUrl?: string | null;
  heroName?: string;
  /** 히어로에 프로필 이미지 표시 여부 (요청 상세는 false) */
  showProfile?: boolean;
  /** 상세 Header 뒤로가기 fallback 목록 경로 */
  backFallbackHref?: string;
  main: ReactNode;
  aside?: ReactNode;
  /** main+aside 바깥 여백·폭. Figma 화면별로 다를 수 있음 */
  contentClassName?: string;
  /** main+aside 가로 컨테이너 */
  rowClassName?: string;
  /** 왼쪽 본문 컬럼 */
  mainClassName?: string;
  /** 오른쪽 aside */
  asideClassName?: string;
  footer?: ReactNode;
}

/**
 * 고객 견적·견적요청 상세 공통 셸 (Header + Hero + main/aside)
 * // 2026.07.30 정슬기 - [추가] pending/received/request 상세 Layout 공통화
 * // 2026.07.30 정슬기 - [수정] 본문 컬럼을 main landmark로 표기
 */
export default function EstimateDetailLayout({
  title,
  heroImageUrl = null,
  heroName = "",
  showProfile = true,
  backFallbackHref,
  main,
  aside,
  contentClassName,
  rowClassName,
  mainClassName,
  asideClassName,
  footer,
}: EstimateDetailLayoutProps) {
  const headerTitle = title ?? "견적 상세";

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <PageHeader title={headerTitle} backFallbackHref={backFallbackHref} />

      <DetailHeroBanner imageUrl={heroImageUrl} name={heroName} showProfile={showProfile} />

      <div
        className={cn(
          "px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center xl:px-0",
          contentClassName,
        )}
      >
        <div
          className={cn(
            // Desktop(xl+)만 좌우 분할 — Tablet은 세로 스택으로 가로 스크롤 방지
            "max-w-container-desktop flex w-full flex-col items-stretch xl:flex-row xl:items-start xl:justify-center",
            rowClassName,
          )}
        >
          <main className={cn("flex w-full min-w-0 flex-col", mainClassName)}>{main}</main>

          {aside ? (
            <aside className={cn("flex w-full min-w-0 flex-col items-start", asideClassName)}>
              {aside}
            </aside>
          ) : null}
        </div>
      </div>

      {footer}
    </div>
  );
}

interface EstimateDetailQueryStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  /** 에러 시 목록 링크 등 추가 액션 */
  secondaryAction?: ReactNode;
  /** 로딩·에러 Header 뒤로가기 fallback */
  backFallbackHref?: string;
}

/** 상세 로딩·에러 — Header만 두고 상태 메시지 표시 */
export function EstimateDetailQueryState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryAction,
  backFallbackHref,
}: EstimateDetailQueryStateProps) {
  const headerTitle = title ?? "견적 상세";

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col overflow-x-hidden">
      <PageHeader title={headerTitle} backFallbackHref={backFallbackHref} />

      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center xl:px-0">
        <div className="max-w-container-desktop w-full">
          <EstimatesQueryStatus message={message} actionLabel={actionLabel} onAction={onAction} />
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}
