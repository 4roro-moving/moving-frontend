"use client";

import { useFormatter, useTranslations } from "next-intl";

import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { ArrowRightIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";

/** 기사님 받은 요청 카드·모달과 동일한 상세 카드 셸 */
export const ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME =
  "border-border-subtle bg-background-surface rounded-20 flex w-full flex-col gap-24 border px-20 py-24 shadow-[0_0_10px_rgba(220,220,220,0.2)] md:gap-32 md:px-40 md:py-32 xl:px-40 xl:py-32";

interface EstimateRequestSummaryContentProps {
  moveType: MoveType;
  isDesignated: boolean;
  /** 제목 (기사: 고객명) */
  title: ReactNode;
  /** 우측 메타 (기사: N분 전) */
  headerMeta?: ReactNode;
  /** 우측 메타 옆 액션 (기사: 신고 더보기) */
  headerAction?: ReactNode;
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
  headerAction,
  fromLabel,
  toLabel,
  moveDate,
  className,
  density = "card",
}: EstimateRequestSummaryContentProps) {
  const t = useTranslations("estimates");
  const format = useFormatter();
  const isModal = density === "modal";

  const locationValueVariant = isModal
    ? ({ base: "md-medium", xl: "lg-medium" } as const)
    : "lg-semibold";

  const locationValueClass = isModal ? "text-text-secondary" : "text-text-primary";

  return (
    <div
      className={cn("flex flex-col", isModal ? "gap-16 xl:gap-20" : "gap-16 md:gap-24", className)}
    >
      <div className="flex min-h-32 items-center justify-between gap-12">
        <div className="flex flex-wrap gap-8">
          <MoveTypeChip moveType={moveType} />

          {isDesignated ? <DesignatedChip /> : null}
        </div>

        {headerMeta || headerAction ? (
          <div className="flex shrink-0 items-center gap-4">
            {headerMeta ? (
              <Text as="span" variant="md-regular" className="text-text-muted shrink-0">
                {headerMeta}
              </Text>
            ) : null}

            {headerAction}
          </div>
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
            ? "gap-8 xl:flex-row xl:items-end xl:gap-48"
            : "gap-12 xl:flex-row xl:justify-between xl:gap-20",
        )}
      >
        <div className="flex items-end gap-12">
          <div className={cn(isModal && "flex items-center gap-8 xl:block")}>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              {t("fromAddress")}
            </Text>

            <Text
              as="dd"
              variant={locationValueVariant}
              className={cn(locationValueClass, "m-0 min-w-0 wrap-break-word")}
            >
              {fromLabel}
            </Text>
          </div>

          <ArrowRightIcon size={16} className={cn("shrink-0", isModal ? "mb-8 xl:mb-9" : "mb-9")} />

          <div className={cn(isModal && "flex items-center gap-8 xl:block")}>
            <Text as="dt" variant="md-regular" className="text-text-muted">
              {t("toAddress")}
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

        <div className={cn(isModal && "flex items-center gap-8 xl:block")}>
          <Text as="dt" variant="md-regular" className="text-text-muted">
            {t("moveDate")}
          </Text>

          <Text
            as="dd"
            variant={locationValueVariant}
            className={cn(locationValueClass, "m-0 whitespace-nowrap")}
          >
            {format.dateTime(new Date(moveDate), {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </Text>
        </div>
      </dl>

      {isModal ? <div className="bg-border-subtle mt-4 h-px xl:mt-0" /> : null}
    </div>
  );
}
