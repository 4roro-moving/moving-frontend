"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailNotice from "@/components/estimate/detail/EstimateDetailNotice";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { toKakaoShareImageUrl } from "@/hooks/kakao/share";
import { buildEstimateShareLine } from "@/lib/share/copy";
import { cn } from "@/lib/utils/cn";

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
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "lg:pt-40")}
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
