import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { formatKoreanDateTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";

/** 기사님 받은 요청 카드·모달과 동일한 상세 카드 셸 */
export const ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME =
  "border-border-subtle bg-background-surface rounded-20 flex w-full flex-col gap-24 border px-20 py-24 shadow-[0_0_10px_rgba(220,220,220,0.2)] min-[744px]:gap-32 min-[744px]:px-40 min-[744px]:py-32 lg:px-40 lg:py-32";

/** 기사님 받은 요청 목록 main과 동일한 콘텐츠 폭·여백 */
export const ESTIMATE_REQUEST_DETAIL_PAGE_CLASSNAME =
  "mx-auto flex w-full max-w-[1200px] flex-col gap-24 px-24 pb-80 min-[744px]:px-[72px] lg:gap-40 lg:px-0";

export interface EstimateRequestSummaryRow {
  label: string;
  value: string;
}

interface EstimateRequestSummaryContentProps {
  moveType: MoveType;
  isDesignated: boolean;
  /** 제목 (기사: 고객명 / 고객: 상태·이사유형 등) */
  title: ReactNode;
  /** 우측 메타 (기사: N분 전 / 고객: 요청일 등) */
  headerMeta?: ReactNode;
  fromLabel: string;
  toLabel: string;
  moveDate: string;
  /** 출발·도착·이사일 외 추가 행 (고객 상세용) */
  extraRows?: EstimateRequestSummaryRow[];
  className?: string;
  /** 모달 요약은 타이포·간격이 약간 다름 */
  density?: "card" | "modal";
}

/**
 * EstimateRequest 요약 블록 — 기사님 받은 요청 카드/모달과 고객 보낸 요청 상세 공통
 * // 2026.07.29 정슬기 - [추가]
 */
export default function EstimateRequestSummaryContent({
  moveType,
  isDesignated,
  title,
  headerMeta,
  fromLabel,
  toLabel,
  moveDate,
  extraRows,
  className,
  density = "card",
}: EstimateRequestSummaryContentProps) {
  const isModal = density === "modal";
  const locationValueVariant = isModal ? "lg-medium" : "lg-semibold";
  const locationValueClass = isModal ? "text-text-secondary" : "text-text-primary";

  return (
    <div
      className={cn("flex flex-col", isModal ? "gap-20" : "gap-16 min-[744px]:gap-24", className)}
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
            ? "gap-16 sm:flex-row sm:items-end sm:gap-48"
            : "gap-12 sm:flex-row sm:justify-between sm:gap-20",
        )}
      >
        <div className="flex items-end gap-12">
          <div>
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
          <span
            className={cn("mb-[9px] flex items-center", isModal ? "w-16" : "w-[18px]")}
            aria-hidden="true"
          >
            <span className="bg-text-secondary h-px flex-1" />
            <span className="border-text-secondary -ml-1 h-1.5 w-1.5 rotate-45 border-t border-r" />
          </span>
          <div>
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
        <div>
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

      {isModal ? <div className="bg-border-subtle h-px" /> : null}

      {extraRows && extraRows.length > 0 ? (
        <dl className="flex flex-col gap-12">
          {extraRows.map((row) => (
            <div key={row.label} className="flex w-full items-start justify-between gap-12">
              <Text as="dt" variant="md-regular" className="text-text-muted shrink-0">
                {row.label}
              </Text>
              <Text
                as="dd"
                variant="lg-semibold"
                className="text-text-primary m-0 min-w-0 text-right wrap-break-word"
              >
                {row.value}
              </Text>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
