"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailLayout, {
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { toKakaoShareImageUrl } from "@/hooks/kakao/share";
import { buildEstimateShareLine } from "@/lib/share/copy";

interface PendingEstimateDetailViewProps {
  estimateId: number;
}

/**
 * 대기 견적 상세 Desktop (Figma 8091:47263)
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] useEstimateDetail·Layout·Actions 통합
 */
export default function PendingEstimateDetailView({ estimateId }: PendingEstimateDetailViewProps) {
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
  const kakaoEstimateShare = {
    share_line: buildEstimateShareLine(displayName),
    profile_image: toKakaoShareImageUrl(data.mover.imageUrl),
    like_count: String(data.mover.favoriteCount),
  };

  return (
    <>
      <EstimateDetailLayout
        heroImageUrl={data.mover.imageUrl}
        heroName={displayName}
        contentClassName="pt-28 pb-80 lg:pb-37-5"
        rowClassName="gap-40 lg:gap-0"
        mainClassName="gap-30 lg:w-185 lg:shrink-0"
        asideClassName="gap-40 lg:w-xs lg:shrink-0 lg:gap-80 lg:overflow-clip lg:pt-40"
        main={
          <>
            <div className="flex w-full flex-col gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <EstimateDetailInfo detail={data} />
          </>
        }
        aside={
          <>
            <EstimateDetailActions
              price={data.price}
              buttonSize="detail"
              isConfirmed={data.isConfirmed}
              canConfirm={data.canConfirm}
              confirmDisabledReason={data.confirmDisabledReason}
              isConfirming={confirmMutation.isPending}
              onConfirm={() => confirmMutation.mutate()}
            />
            <EstimateDetailShare
              linkAccess="owner"
              kakaoEstimateShare={kakaoEstimateShare}
              onToastMessage={setToastMessage}
            />
          </>
        }
      />
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
