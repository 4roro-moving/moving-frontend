"use client";

import { useState } from "react";

import ChatRoomModalContainer from "@/components/chat/ChatRoomModalContainer";
import { Text } from "@/components/common/Text";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailPageSkeleton from "@/components/estimate/detail/EstimateDetailPageSkeleton";
import SentEstimateChatAction from "@/components/estimate/sent/SentEstimateChatAction";
import SentEstimateCompleteAction from "@/components/estimate/sent/SentEstimateCompleteAction";
import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";
import { useSentEstimateDetail } from "@/hooks/useSentEstimates";
import FrameIcon from "@/icons/frame.svg";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { MOVE_TYPE_LABEL } from "@/lib/constants/moveType";
import {
  formatKoreanDateTime,
  formatKoreanDateTimeWithTime,
  isKstDateOnOrAfter,
} from "@/lib/utils/date";
import { formatPrice } from "@/lib/utils/estimateFormat";
import type { SentEstimate } from "@/types/sentEstimate";

interface SentEstimateDetailPageProps {
  estimateId: number;
}

function formatAddress(address: string, detailAddress: string | null) {
  return [address, detailAddress].filter(Boolean).join(" ");
}

function SentEstimateSummary({ estimate }: { estimate: SentEstimate }) {
  const isConfirmed = estimate.status !== "SENT";
  const statusLabel = estimate.status === "COMPLETED" ? "이사완료" : "확정견적";

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
              <FrameIcon className="text-icon-brand size-20 shrink-0" />
              <Text variant="lg-bold">{statusLabel}</Text>
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

function SentEstimateComment({ comment }: { comment: string }) {
  return (
    <section
      className="flex w-full flex-col gap-20 md:gap-28"
      aria-labelledby="mover-comment-title"
    >
      <h2 id="mover-comment-title" className="text-text-primary">
        <Text as="span" variant="lg-semibold" className="md:hidden">
          기사님 코멘트
        </Text>
        <Text as="span" variant="xl-semibold" className="hidden md:inline">
          기사님 코멘트
        </Text>
      </h2>

      <Text
        as="p"
        variant="lg-medium"
        className="text-text-muted wrap-break-word whitespace-pre-wrap"
      >
        {comment}
      </Text>
    </section>
  );
}

export default function SentEstimateDetailPage({ estimateId }: SentEstimateDetailPageProps) {
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const query = useSentEstimateDetail(estimateId);

  if (query.isPending) {
    return <EstimateDetailPageSkeleton />;
  }

  if (query.isError || !query.data) {
    return (
      <EstimateDetailQueryState
        title="견적 상세"
        message="견적을 불러오지 못했어요."
        backFallbackHref={APP_ROUTES.MOVER_ESTIMATES.SENT}
        actionLabel="다시 시도"
        onAction={() => void query.refetch()}
      />
    );
  }

  const estimate = query.data;
  const request = estimate.estimateRequest;
  // 2026.08.06 김성현 - [수정] 견적 조율 가능한 보낸 견적에서 채팅방 진입 CTA 노출
  const showChatAction = estimate.status === "SENT";
  const showCompleteAction =
    estimate.status === "CONFIRMED" && isKstDateOnOrAfter(request.moveDate);

  return (
    <>
      <EstimateDetailLayout
        showProfile={false}
        backFallbackHref={APP_ROUTES.MOVER_ESTIMATES.SENT}
        contentClassName="pt-35 pb-64 md:pt-[46px] md:pb-80 lg:pt-[43px] lg:pb-37-5"
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName="gap-20 md:gap-30 xl:w-210 xl:shrink-0"
        asideClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName}
        main={
          <>
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <SentEstimateSummary estimate={estimate} />
              <EstimateDetailPrice price={estimate.price} />
            </div>

            <div className="flex w-full flex-col gap-20 md:gap-28">
              <EstimateDetailInfoSection
                rows={[
                  {
                    label: "견적 요청일",
                    value: formatKoreanDateTime(request.requestedAt),
                  },
                  {
                    label: "서비스",
                    value: MOVE_TYPE_LABEL[request.moveType],
                  },
                  {
                    label: "이용일",
                    value: formatKoreanDateTime(request.moveDate),
                  },
                  {
                    label: "출발지",
                    value: formatAddress(request.fromAddress, request.fromDetailAddress),
                  },
                  {
                    label: "도착지",
                    value: formatAddress(request.toAddress, request.toDetailAddress),
                  },
                  ...(request.completedAt
                    ? [
                        {
                          label: "이사 완료일시",
                          value: formatKoreanDateTimeWithTime(request.completedAt),
                        },
                      ]
                    : []),
                ]}
              />
              <div className="border-border-subtle w-full border-t" aria-hidden="true" />
            </div>

            <SentEstimateComment comment={estimate.comment} />
            {showCompleteAction ? <SentEstimateCompleteAction estimateId={estimate.id} /> : null}
          </>
        }
        aside={
          showChatAction ? (
            <SentEstimateChatAction
              estimateId={estimate.id}
              onClick={() => setIsChatModalOpen(true)}
            />
          ) : undefined
        }
      />

      <ChatRoomModalContainer
        open={isChatModalOpen}
        estimateId={estimate.id}
        participantRole="MOVER"
        participantName={estimate.customer.name}
        estimateSummary={`견적가 - ${estimate.price.toLocaleString("ko-KR")}원`}
        estimateEdit={{
          moveDateLabel: formatKoreanDateTime(request.moveDate),
          priceLabel: formatPrice(estimate.price),
        }}
        onClose={() => setIsChatModalOpen(false)}
      />
    </>
  );
}
