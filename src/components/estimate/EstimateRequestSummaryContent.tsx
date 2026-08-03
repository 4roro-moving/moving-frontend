import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { ArrowRightIcon } from "@/icons";
import { formatKoreanDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";

/** 기사님 받은 요청 카드·모달과 동일한 상세 카드 셸 */
export const ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME =
  "border-border-subtle bg-background-surface rounded-20 flex w-full flex-col gap-24 border px-20 py-24 shadow-[0_0_10px_rgba(220,220,220,0.2)] min-[744px]:gap-32 min-[744px]:px-40 min-[744px]:py-32 lg:px-40 lg:py-32";

interface EstimateRequestSummaryContentProps {
  moveType: MoveType;
  isDesignated: boolean;
  /** 제목 (기사: 고객명) */
  title: ReactNode;
  /** 우측 메타 (기사: N분 전) */
  headerMeta?: ReactNode;
  fromLabel: string;
  toLabel: string;
  moveDate: string;
  className?: string;
  /** 모달 요약은 타이포·간격이 약간 다름 */
  density?: "card" | "modal";
}

/**
 * EstimateRequest 요약 블록 — 기사님 받은 요청 카드·모달 전용
 * (고객 보낸 요청 상세는 EstimateDetail 셸 + EstimateRequestDetailSummary 사용)
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] 미사용 PAGE_CLASSNAME·extraRows 제거
 */
export default function EstimateRequestSummaryContent({
  moveType,
  isDesignated,
  title,
  headerMeta,
  fromLabel,
  toLabel,
  moveDate,
  className,
  density = "card",
}: EstimateRequestSummaryContentProps) {
  const isModal = density === "modal";
  const locationValueVariant = isModal
    ? ({ base: "md-medium", lg: "lg-medium" } as const)
    : "lg-semibold";
  const locationValueClass = isModal ? "text-text-secondary" : "text-text-primary";

  return (
    <div
      className={cn(
        "flex flex-col",
        isModal ? "gap-16 lg:gap-20" : "gap-16 min-[744px]:gap-24",
        className,
      )}
    >
      <div className="flex min-h-32 items-center justify-between gap-12">
        <div className="flex flex-wrap gap-8">
          <MoveTypeChip moveType={moveType} />
          {isDesignated ? <DesignatedChip /> : null}
        </div>
        {headerMeta ? (
          <Text as="span" variant="md-regular" className="text-text-muted shrink-0">
            {headerMeta}
          </Text>
        ) : null}
      </div>

      <div className={cn("flex flex-col", isModal ? "gap-0" : "gap-12")}>
        <Text as="h2" variant="xl-semibold" className="text-text-tertiary">
          {title}
        </Text>
        {!isModal ? <div className="bg-border-subtle h-px" /> : null}
      </div>

      <dl
        className={cn(
          "flex flex-col",
          isModal
            ? "gap-8 lg:flex-row lg:items-end lg:gap-48"
            : "gap-12 lg:flex-row lg:justify-between lg:gap-20",
        )}
      >
        <div className="flex items-end gap-12">
          <div className={cn(isModal && "flex items-center gap-8 lg:block")}>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              출발지
            </Text>
            <Text
              as="dd"
              variant={locationValueVariant}
              className={cn(locationValueClass, "m-0 min-w-0 wrap-break-word")}
            >
              {fromLabel}
            </Text>
          </div>
          <ArrowRightIcon
            size={16}
            className={cn("shrink-0", isModal ? "mb-8 lg:mb-[9px]" : "mb-[9px]")}
          />
          <div className={cn(isModal && "flex items-center gap-8 lg:block")}>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              도착지
            </Text>
            <Text
              as="dd"
              variant={locationValueVariant}
              className={cn(locationValueClass, "m-0 min-w-0 wrap-break-word")}
            >
              {toLabel}
            </Text>
          </div>
        </div>
        <div className={cn(isModal && "flex items-center gap-8 lg:block")}>
          <Text as="dt" variant="md-regular" className="text-text-muted">
            이사일
          </Text>
          <Text
            as="dd"
            variant={locationValueVariant}
            className={cn(locationValueClass, "m-0 whitespace-nowrap")}
          >
            {formatKoreanDateTime(moveDate)}
          </Text>
        </div>
      </dl>

      {isModal ? <div className="bg-border-subtle mt-4 h-px lg:mt-0" /> : null}
    </div>
  );
}
