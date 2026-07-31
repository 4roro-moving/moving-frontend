"use client";

import { Text } from "@/components/common/Text";
import EstimateDetailLayout from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import FrameIcon from "@/icons/frame.svg";

interface SentEstimateDetailPageProps {
  estimateId: number;
}

// 추후 백엔드 API 개발 후 수정하겠습니다.
const DETAIL = {
  customerName: "김민서",
  moveType: "OFFICE" as const,
  isDesignated: true,
  price: 180000,
  requestedAt: "24.08.26",
  moveDate: "2024. 08. 26(월) 오전 10:00",
  fromAddress: "서울 중구 삼일대로 343",
  toAddress: "서울 강남구 선릉로 428",
};

function SentEstimateSummary() {
  return (
    <section className="flex w-full flex-col gap-20 md:gap-26" aria-label="확정 견적 요약">
      <div className="flex w-full flex-col gap-12 md:gap-20">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-8 md:gap-12">
            <MoveTypeChip moveType={DETAIL.moveType} size="sm" className="md:hidden" />
            <MoveTypeChip moveType={DETAIL.moveType} size="md" className="hidden md:inline-flex" />
            {DETAIL.isDesignated ? (
              <>
                <DesignatedChip size="sm" className="md:hidden" />
                <DesignatedChip size="md" className="hidden md:inline-flex" />
              </>
            ) : null}
          </div>

          <span className="text-text-brand flex shrink-0 items-center gap-4">
            <FrameIcon className="size-20 shrink-0" aria-hidden="true" />
            <Text variant="lg-bold">확정견적</Text>
          </span>
        </div>

        <Text
          as="h2"
          variant={{ base: "lg-semibold", md: "2xl-semibold" }}
          className="text-text-secondary"
        >
          {DETAIL.customerName} 고객님
        </Text>
      </div>

      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}

export default function SentEstimateDetailPage({ estimateId }: SentEstimateDetailPageProps) {
  return (
    <EstimateDetailLayout
      key={estimateId}
      showProfile={false}
      contentClassName="pt-35 pb-64 md:pt-[46px] md:pb-80 lg:pt-[43px] lg:pb-37-5"
      rowClassName="gap-20 md:gap-32 lg:gap-0"
      mainClassName="gap-20 md:gap-30 lg:w-185"
      asideClassName="border-border-subtle gap-12 border-t pt-20 md:gap-22 md:pt-32 lg:w-xs lg:border-t-0 lg:pt-0"
      main={
        <>
          <div className="flex w-full flex-col gap-20 md:gap-26">
            <SentEstimateSummary />
            <EstimateDetailPrice price={DETAIL.price} />
          </div>

          <EstimateDetailInfoSection
            rows={[
              { label: "견적 요청일", value: DETAIL.requestedAt },
              { label: "서비스", value: "사무실이사" },
              { label: "이용일", value: DETAIL.moveDate },
              { label: "출발지", value: DETAIL.fromAddress },
              { label: "도착지", value: DETAIL.toAddress },
            ]}
          />
        </>
      }
      aside={<EstimateDetailShare linkAccess="owner" />}
    />
  );
}
