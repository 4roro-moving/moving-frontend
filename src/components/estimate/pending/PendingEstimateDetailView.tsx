"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailHeader from "@/components/estimate/detail/EstimateDetailHeader";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import PendingEstimateDetailActions from "@/components/estimate/pending/PendingEstimateDetailActions";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import {
  useConfirmPendingEstimateDetail,
  usePendingEstimateDetail,
} from "@/hooks/usePendingEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface PendingEstimateDetailViewProps {
  estimateId: number;
}

/**
 * 대기 견적 상세 Desktop (Figma 8091:47263)
 * 기존 received `/estimates/[estimateId]` View와 분리 — 받은 상세 코드 미수정
 * // 2026.07.25 정슬기 - [추가] pending detail Page Client
 */
export default function PendingEstimateDetailView({ estimateId }: PendingEstimateDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = usePendingEstimateDetail(estimateId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confirmMutation = useConfirmPendingEstimateDetail(estimateId, {
    onSuccess: () => setToastMessage("견적이 확정되었습니다."),
    onError: setToastMessage,
  });

  if (isLoading) {
    return (
      <div className="bg-background-default flex w-full flex-col">
        <EstimateDetailHeader />
        <ReceivedEstimatesStatus message="견적 상세를 불러오는 중입니다." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-background-default flex w-full flex-col">
        <EstimateDetailHeader />
        <ReceivedEstimatesStatus
          message={getApiErrorMessage(error, "견적 상세를 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      </div>
    );
  }

  const displayName = data.mover.nickname || data.mover.name;

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <EstimateDetailHeader />
      <EstimateDetailHero imageUrl={data.mover.imageUrl} name={displayName} />

      {/* Desktop Figma 8091:47265 — 1200 / 740+140+320, main pt 28, action pt 40 / gap 80 */}
      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-28 pb-80 lg:px-0 lg:pb-37.5">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-40 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <div className="flex w-full min-w-0 flex-col gap-30 lg:w-185 lg:shrink-0">
            <div className="flex w-full flex-col gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <EstimateDetailInfo detail={data} />
          </div>

          <aside className="flex w-full min-w-0 flex-col items-start gap-40 lg:w-xs lg:shrink-0 lg:gap-80 lg:overflow-clip lg:pt-40">
            <PendingEstimateDetailActions
              price={data.price}
              isConfirmed={data.isConfirmed}
              canConfirm={data.canConfirm}
              confirmDisabledReason={data.confirmDisabledReason}
              isConfirming={confirmMutation.isPending}
              onConfirm={() => confirmMutation.mutate()}
            />
            <EstimateDetailShare onToastMessage={setToastMessage} />
          </aside>
        </div>
      </div>

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
