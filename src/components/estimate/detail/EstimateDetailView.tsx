"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailHeader from "@/components/estimate/detail/EstimateDetailHeader";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailNotice from "@/components/estimate/detail/EstimateDetailNotice";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface EstimateDetailViewProps {
  estimateId: number;
}

export default function EstimateDetailView({ estimateId }: EstimateDetailViewProps) {
  // 2026.07.24 정슬기 - [추가] 견적 상세 API 연동 및 확정 mutation 연결
  const { data, isLoading, isError, error, refetch } = useEstimateDetail(estimateId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confirmMutation = useConfirmEstimate(estimateId, {
    onSuccess: () => setToastMessage("견적이 확정되었습니다."),
    onError: setToastMessage,
  });

  // 2026.07.24 정슬기 - [추가] 상세 로딩·에러 상태 처리
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

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <EstimateDetailHeader />
      <EstimateDetailHero
        imageUrl={data.mover.imageUrl}
        name={data.mover.nickname || data.mover.name}
      />

      {/* 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 여백·단일 컬럼, Desktop(lg) 2열 유지 */}
      {/* 2026.07.24 정슬기 - [수정] container-desktop max-width 토큰 유틸 사용 */}
      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-24 pb-64 md:pt-28 md:pb-80 lg:px-0 lg:pb-[150px]">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-32 md:gap-40 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-24 md:gap-30 lg:w-[740px]">
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <EstimateDetailInfo detail={data} />
            {/* 2026.07.29 정슬기 - [추가] 미확정 상세 Figma notice 배너 (확정 CTA는 aside 유지) */}
            {!data.isConfirmed ? <EstimateDetailNotice /> : null}
          </div>

          <aside className="flex w-full min-w-0 flex-col items-start gap-28 md:gap-40 lg:w-[320px] lg:overflow-clip lg:pt-40">
            {/* 2026.07.24 정슬기 - [추가] API canConfirm 기준으로 확정 버튼 노출·비활성화 */}
            <EstimateDetailActions
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
