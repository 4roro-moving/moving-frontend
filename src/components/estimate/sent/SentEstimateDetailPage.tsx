"use client";

import { Text } from "@/components/common/Text";
import EstimateDetailLayout, {
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { useSentEstimateDetail } from "@/hooks/useSentEstimates";
import FrameIcon from "@/icons/frame.svg";
import { MOVE_TYPE_LABEL } from "@/lib/constants/moveType";
import { formatKoreanDateTime } from "@/lib/utils/date";
import type { SentEstimate } from "@/types/sentEstimate";

interface SentEstimateDetailPageProps {
  estimateId: number;
}

function formatAddress(address: string, detailAddress: string | null) {
  return [address, detailAddress].filter(Boolean).join(" ");
}

function SentEstimateSummary({ estimate }: { estimate: SentEstimate }) {
  const isConfirmed = estimate.status !== "SENT";

  return (
    <section className="flex w-full flex-col gap-20 md:gap-26" aria-label="보낸 견적 요약">
      <div className="flex w-full flex-col gap-12 md:gap-20">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8 md:gap-12">
            <MoveTypeChip
              moveType={estimate.estimateRequest.moveType}
              size="sm"
              className="md:hidden"
            />
            <MoveTypeChip
              moveType={estimate.estimateRequest.moveType}
              size="md"
              className="hidden md:inline-flex"
            />
            {estimate.isDesignated ? (
              <>
                <DesignatedChip size="sm" className="md:hidden" />
                <DesignatedChip size="md" className="hidden md:inline-flex" />
              </>
            ) : null}
          </div>

          {isConfirmed ? (
            <span className="text-text-brand flex shrink-0 items-center gap-4">
              <FrameIcon className="size-20 shrink-0" aria-hidden="true" />
              <Text variant="lg-bold">확정견적</Text>
            </span>
          ) : null}
        </div>

        <Text
          as="h2"
          variant={{ base: "lg-semibold", md: "2xl-semibold" }}
          className="text-text-secondary"
        >
          {estimate.customer.name} 고객님
        </Text>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}

export default function SentEstimateDetailPage({ estimateId }: SentEstimateDetailPageProps) {
  const query = useSentEstimateDetail(estimateId);

  if (query.isPending) {
    return <EstimateDetailQueryState title="견적 상세" message="견적을 불러오는 중이에요." />;
  }

  if (query.isError || !query.data) {
    return (
      <EstimateDetailQueryState
        title="견적 상세"
        message="견적을 불러오지 못했어요."
        actionLabel="다시 시도"
        onAction={() => void query.refetch()}
      />
    );
  }

  const estimate = query.data;
  const request = estimate.estimateRequest;

  return (
    <EstimateDetailLayout
      showProfile={false}
      contentClassName="pt-35 pb-64 md:pt-[46px] md:pb-80 lg:pt-[43px] lg:pb-37-5"
      rowClassName="gap-20 md:gap-32 lg:gap-0"
      mainClassName="gap-20 md:gap-30 lg:w-185"
      asideClassName="border-border-subtle gap-12 border-t pt-20 md:gap-22 md:pt-32 lg:w-xs lg:border-t-0 lg:pt-0"
      main={
        <>
          <div className="flex w-full flex-col gap-20 md:gap-26">
            <SentEstimateSummary estimate={estimate} />
            <EstimateDetailPrice price={estimate.price} />
          </div>

          <EstimateDetailInfoSection
            rows={[
              { label: "견적 요청일", value: formatKoreanDateTime(request.requestedAt) },
              { label: "서비스", value: MOVE_TYPE_LABEL[request.moveType] },
              { label: "이용일", value: formatKoreanDateTime(request.moveDate) },
              {
                label: "출발지",
                value: formatAddress(request.fromAddress, request.fromDetailAddress),
              },
              {
                label: "도착지",
                value: formatAddress(request.toAddress, request.toDetailAddress),
              },
            ]}
          />
        </>
      }
      aside={<EstimateDetailShare linkAccess="owner" />}
    />
  );
}
