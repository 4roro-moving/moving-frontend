import { Text } from "@/components/common/Text";
import {
  formatMoveDateLabel,
  formatRequestDateLabel,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import type { ReceivedEstimateRequestSummary } from "@/types/estimate";

interface EstimateRequestSummaryProps {
  data: ReceivedEstimateRequestSummary;
}

/**
 * 받았던 견적 목록 패널 — 요청 요약
 * // 2026.07.24 정슬기 - [수정] Mobile 날짜 하단 배치, Tablet 세로·Desktop(lg) 고정폭 유지
 * // 2026.07.29 정슬기 - [수정] Mobile 제목 가운데 정렬·요약 divider (Figma Mobile)
 *
 * 이 컴포넌트는 received EstimateDetailPanel에서만 사용됩니다.
 */
export default function EstimateRequestSummary({ data }: EstimateRequestSummaryProps) {
  const requestDate = formatRequestDateLabel(data.createdAt);

  return (
    <section
      className="flex w-full flex-col gap-16 md:gap-24 lg:w-[260px] lg:shrink-0 lg:gap-40"
      aria-label="견적 정보"
    >
      <div className="flex w-full items-center justify-center md:justify-between">
        <Text
          as="h2"
          variant="xl-semibold"
          className="text-text-secondary text-center md:text-left"
        >
          견적 정보
        </Text>
        <Text
          as="time"
          dateTime={data.createdAt}
          variant="md-regular"
          className="text-text-muted hidden md:inline"
        >
          {requestDate}
        </Text>
      </div>

      <dl className="flex w-full flex-col gap-12 md:gap-16">
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            이사 유형
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary text-right break-words">
            {getMoveTypeLabel(data.moveType)}
          </Text>
        </div>

        {/* Figma Mobile: 이사 유형 ↔ 출발지 divider */}
        <div className="border-border-subtle w-full border-t md:hidden" aria-hidden="true" />

        <div className="flex w-full items-start justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            출발지
          </Text>
          <Text
            as="dd"
            variant="lg-semibold"
            className="text-text-primary min-w-0 text-right break-words"
          >
            {data.fromAddress}
          </Text>
        </div>
        <div className="flex w-full items-start justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            도착지
          </Text>
          <Text
            as="dd"
            variant="lg-semibold"
            className="text-text-primary min-w-0 text-right break-words"
          >
            {data.toAddress}
          </Text>
        </div>

        {/* Figma Mobile: 도착지 ↔ 이용일 divider */}
        <div className="border-border-subtle w-full border-t md:hidden" aria-hidden="true" />

        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            이용일
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary text-right break-words">
            {formatMoveDateLabel(data.moveDate)}
          </Text>
        </div>
      </dl>

      <Text
        as="time"
        dateTime={data.createdAt}
        variant="md-regular"
        className="text-text-muted self-end md:hidden"
      >
        {requestDate}
      </Text>
    </section>
  );
}
