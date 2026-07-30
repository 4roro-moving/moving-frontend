"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailLayout, {
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailNotice from "@/components/estimate/detail/EstimateDetailNotice";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface EstimateDetailViewProps {
  estimateId: number;
}

/**
 * 받았던 견적 상세
 * // 2026.07.24 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] EstimateDetailLayout·공통 Actions 사용
 */
export default function EstimateDetailView({ estimateId }: EstimateDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useEstimateDetail(estimateId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const confirmMutation = useConfirmEstimate(estimateId, {
    onSuccess: () => setToastMessage("견적이 확정되었습니다."),
    onError: setToastMessage,
  });

  if (isLoading) {
    return <EstimateDetailQueryState message="견적 상세를 불러오는 중입니다." />;
  }

  if (isError || !data) {
    return (
      <EstimateDetailQueryState
        message={getApiErrorMessage(error, "견적 상세를 불러오지 못했습니다.")}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
      />
    );
  }

  const displayName = data.mover.nickname || data.mover.name;

  return (
    <>
      <EstimateDetailLayout
        heroImageUrl={data.mover.imageUrl}
        heroName={displayName}
        contentClassName="pt-24 pb-64 md:pt-28 md:pb-80 lg:pb-[150px]"
        rowClassName="gap-32 md:gap-40"
        mainClassName="gap-24 md:gap-30 lg:w-[740px]"
        asideClassName="gap-28 md:gap-40 lg:w-[320px] lg:overflow-clip lg:pt-40"
        main={
          <>
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <EstimateDetailInfo detail={data} />
            {!data.isConfirmed ? <EstimateDetailNotice /> : null}
          </>
        }
        aside={
          <>
            <EstimateDetailActions
              isConfirmed={data.isConfirmed}
              canConfirm={data.canConfirm}
              confirmDisabledReason={data.confirmDisabledReason}
              isConfirming={confirmMutation.isPending}
              onConfirm={() => confirmMutation.mutate()}
            />
            <EstimateDetailShare onToastMessage={setToastMessage} />
          </>
        }
      />
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
