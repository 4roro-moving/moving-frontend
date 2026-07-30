import type { ReactNode } from "react";

import EstimateDetailHeader from "@/components/estimate/detail/EstimateDetailHeader";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { cn } from "@/lib/utils/cn";

interface EstimateDetailLayoutProps {
  title?: string;
  heroImageUrl?: string | null;
  heroName?: string;
  /** 히어로에 프로필 이미지 표시 여부 (요청 상세는 false) */
  showProfile?: boolean;
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
 */
export default function EstimateDetailLayout({
  title,
  heroImageUrl = null,
  heroName = "",
  showProfile = true,
  main,
  aside,
  contentClassName,
  rowClassName,
  mainClassName,
  asideClassName,
  footer,
}: EstimateDetailLayoutProps) {
  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <EstimateDetailHeader title={title} />
      <EstimateDetailHero imageUrl={heroImageUrl} name={heroName} showProfile={showProfile} />

      <div
        className={cn(
          "px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center lg:px-0",
          contentClassName,
        )}
      >
        <div
          className={cn(
            "max-w-container-desktop flex w-full flex-col items-stretch lg:flex-row lg:items-start lg:justify-between",
            rowClassName,
          )}
        >
          <div className={cn("flex w-full min-w-0 flex-col", mainClassName)}>{main}</div>
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
}

/** 상세 로딩·에러 — Header만 두고 상태 메시지 표시 */
export function EstimateDetailQueryState({
  title,
  message,
  actionLabel,
  onAction,
  secondaryAction,
}: EstimateDetailQueryStateProps) {
  return (
    <div className="bg-background-default flex w-full max-w-full flex-col overflow-x-hidden">
      <EstimateDetailHeader title={title} />
      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center lg:px-0">
        <div className="max-w-container-desktop w-full">
          <EstimatesQueryStatus message={message} actionLabel={actionLabel} onAction={onAction} />
          {secondaryAction}
        </div>
      </div>
    </div>
  );
}
