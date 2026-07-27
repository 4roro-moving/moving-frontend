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

export default function EstimateRequestSummary({ data }: EstimateRequestSummaryProps) {
  const requestDate = formatRequestDateLabel(data.createdAt);

  return (
    // 2026.07.24 정슬기 - [수정] Mobile 날짜 하단 배치, Tablet 세로·Desktop(lg) 고정폭 유지
    <section
      className="flex w-full flex-col gap-16 md:gap-24 lg:w-[260px] lg:shrink-0 lg:gap-40"
      aria-label="견적 정보"
    >
      <div className="flex w-full items-center justify-between">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
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
