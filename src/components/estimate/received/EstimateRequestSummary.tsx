import { Text } from "@/components/common/Text";
import type { EstimateRequestSummaryData } from "@/types/estimate";

interface EstimateRequestSummaryProps {
  data: EstimateRequestSummaryData;
}

export default function EstimateRequestSummary({ data }: EstimateRequestSummaryProps) {
  return (
    <section className="flex w-[260px] shrink-0 flex-col gap-40" aria-label="견적 정보">
      <div className="flex w-full items-center justify-between">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
          견적 정보
        </Text>
        <Text as="time" variant="md-regular" className="text-text-muted">
          {data.createdAtLabel}
        </Text>
      </div>

      <dl className="flex w-full flex-col gap-16">
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            이사 유형
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary">
            {data.moveTypeLabel}
          </Text>
        </div>
        <div className="flex w-full items-start justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            출발지
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary text-right">
            {data.fromAddress}
          </Text>
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            도착지
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary text-right">
            {data.toAddress}
          </Text>
        </div>
        <div className="flex w-full items-center justify-between gap-12">
          <Text as="dt" variant="lg-semibold" className="text-text-brand shrink-0">
            이용일
          </Text>
          <Text as="dd" variant="lg-semibold" className="text-text-primary text-right">
            {data.moveDateLabel}
          </Text>
        </div>
      </dl>
    </section>
  );
}
