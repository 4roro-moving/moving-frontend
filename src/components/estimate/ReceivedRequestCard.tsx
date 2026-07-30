"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";

import Button from "@/components/common/Button/Button";
import EstimateRequestSummaryContent, {
  ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME,
} from "@/components/estimate/EstimateRequestSummaryContent";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

function formatElapsedTime(date: string) {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

const subscribeNoop = () => () => {};

/** 서버 스냅샷은 비워 두고, 클라이언트에서만 상대 시각을 계산해 hydration mismatch를 피합니다. */
function useElapsedLabel(createdAt: string): string | undefined {
  return useSyncExternalStore(
    subscribeNoop,
    () => formatElapsedTime(createdAt),
    () => undefined,
  );
}

interface ReceivedRequestCardProps {
  request: MoverEstimateRequest;
  onSendEstimate: (request: MoverEstimateRequest) => void;
  onRejectEstimate: (request: MoverEstimateRequest) => void;
}

/**
 * 기사님 받은 견적 요청 카드
 * 요약 UI는 EstimateRequestSummaryContent 공통 사용, 액션만 기사 전용
 * // 2026.07.29 정슬기 - [수정] 요청 요약 공통 컴포넌트 분리
 * // 2026.07.30 정슬기 - [수정] elapsed time을 클라이언트 전용으로 계산해 hydration mismatch 방지
 */
export default function ReceivedRequestCard({
  request,
  onSendEstimate,
  onRejectEstimate,
}: ReceivedRequestCardProps) {
  const elapsedLabel = useElapsedLabel(request.createdAt);

  return (
    <article className={ESTIMATE_REQUEST_DETAIL_CARD_CLASSNAME}>
      <EstimateRequestSummaryContent
        moveType={request.moveType}
        isDesignated={request.isDesignated}
        title={`${request.customer.name} 고객님`}
        headerMeta={elapsedLabel}
        fromLabel={request.fromRegion}
        toLabel={request.toRegion}
        moveDate={request.moveDate}
      />

      <div className="flex flex-col gap-[11px] sm:grid sm:grid-cols-2 sm:gap-[11px]">
        <Button
          variant="outline"
          size="cta"
          fullWidth
          className="order-2 sm:order-1"
          onClick={() => onRejectEstimate(request)}
        >
          반려하기
        </Button>
        <Button
          size="cta"
          fullWidth
          className="order-1"
          onClick={() => onSendEstimate(request)}
          rightIcon={<Image src="/icons/write.svg" alt="" width={24} height={24} />}
        >
          견적 보내기
        </Button>
      </div>
    </article>
  );
}
