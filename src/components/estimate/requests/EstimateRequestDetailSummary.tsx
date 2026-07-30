import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { ConfirmedCheckIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { MoveType } from "@/types/move";

interface EstimateRequestDetailSummaryProps {
  moveType: MoveType;
  isDesignated: boolean;
  /** 카드/상세 제목 (고객: 이사유형 등 — View adapter에서 전달) */
  title: ReactNode;
  /** 우측 상태 문구 */
  statusLabel: string;
  /** 상태 라벨 색상 클래스 (예: text-text-brand / text-text-error) */
  statusClassName?: string;
  /** Figma 확정견적처럼 체크 아이콘 표시 */
  showConfirmedIcon?: boolean;
}

/**
 * 보낸 견적 요청 상세 상단 요약 (칩 + 제목 + 상태)
 * Figma 견적 상세(8093:49878) 헤더 구조. 데이터는 props로만 받아 role 분기 없음.
 * // 2026.07.29 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] title·statusLabel을 View adapter props로 분리
 */
export default function EstimateRequestDetailSummary({
  moveType,
  isDesignated,
  title,
  statusLabel,
  statusClassName = "text-text-brand",
  showConfirmedIcon = false,
}: EstimateRequestDetailSummaryProps) {
  const statusBadge = showConfirmedIcon ? (
    <span className="flex shrink-0 items-center gap-4">
      <ConfirmedCheckIcon className="text-icon-brand size-20 shrink-0" />
      <Text as="span" variant="lg-bold" className={statusClassName}>
        {statusLabel}
      </Text>
    </span>
  ) : (
    <Text as="span" variant="lg-semibold" className={cn("shrink-0", statusClassName)}>
      {statusLabel}
    </Text>
  );

  return (
    <section className="flex w-full flex-col gap-16 md:gap-20" aria-label="견적 요청 요약">
      <div className="flex w-full flex-col gap-12">
        {/* Figma 8093:49879 — chip gap 12 */}
        <div className="flex flex-wrap items-center gap-8 md:gap-12">
          <MoveTypeChip moveType={moveType} />
          {isDesignated ? <DesignatedChip /> : null}
          <div className="md:hidden">{statusBadge}</div>
        </div>

        <div className="flex w-full items-start justify-between gap-12">
          <Text
            as="h2"
            variant={{ base: "2lg-semibold", md: "2xl-semibold" }}
            className="text-text-secondary min-w-0 wrap-break-word"
          >
            {title}
          </Text>
          <div className="hidden shrink-0 md:block">{statusBadge}</div>
        </div>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
