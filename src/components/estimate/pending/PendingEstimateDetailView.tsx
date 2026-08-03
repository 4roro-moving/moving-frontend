"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailComment from "@/components/estimate/detail/EstimateDetailComment";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateRequestCancelConfirmModal from "@/components/estimate/requests/EstimateRequestCancelConfirmModal";
import { ESTIMATE_REQUEST_CANCELED_TOAST_KEY } from "@/components/estimate/requests/estimateRequestCancelToast";
import { useCancelEstimateRequest } from "@/hooks/useCancelEstimateRequest";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { isCancelableEstimateRequestStatus } from "@/lib/utils/estimateFormat";
import type { EstimateDetail } from "@/types/estimate";

interface PendingEstimateDetailViewProps {
  estimateId: number;
}

interface PendingEstimateDetailContentProps {
  estimateId: number;
  data: EstimateDetail;
}

/**
 * 데이터 로드 후 본문 — estimateRequest.id로 취소 Hook 연결
 * // 2026.08.03 정슬기 - [추가]
 */
function PendingEstimateDetailContent({ estimateId, data }: PendingEstimateDetailContentProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const estimateRequestId = data.estimateRequest.id;
  const canCancelRequest = isCancelableEstimateRequestStatus(data.estimateRequest.status);
  const displayName = data.mover.nickname || data.mover.name;

  const confirmMutation = useConfirmEstimate(estimateId, {
    onSuccess: () => setToastMessage("견적이 확정되었습니다."),
    onError: setToastMessage,
  });

  const closeCancelModal = useCallback(() => {
    setIsCancelModalOpen(false);
  }, []);

  const cancelMutation = useCancelEstimateRequest(estimateRequestId, {
    onSuccess: () => {
      setIsCancelModalOpen(false);
      try {
        sessionStorage.setItem(ESTIMATE_REQUEST_CANCELED_TOAST_KEY, "1");
      } catch {
        // sessionStorage 불가 환경에서는 Toast 없이 이동
      }
      router.push(APP_ROUTES.ESTIMATES.REQUESTS);
    },
    onError: (message) => {
      setToastMessage(message);
    },
  });

  const isCancelPending = cancelMutation.isPending;

  return (
    <>
      <EstimateDetailLayout
        heroImageUrl={data.mover.imageUrl}
        heroName={displayName}
        contentClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName, "pt-28")}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "lg:gap-80 lg:pt-40")}
        main={
          <>
            <div className="flex w-full flex-col gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <div className="flex w-full flex-col gap-20 md:gap-28">
              <EstimateDetailInfo detail={data} />
              {data.comment.trim() ? (
                <div className="border-border-subtle w-full border-t" aria-hidden="true" />
              ) : null}
            </div>
            <EstimateDetailComment comment={data.comment} />
          </>
        }
        aside={
          <EstimateDetailActions
            price={data.price}
            buttonSize="detail"
            isConfirmed={data.isConfirmed}
            canConfirm={data.canConfirm}
            confirmDisabledReason={data.confirmDisabledReason}
            isConfirming={confirmMutation.isPending}
            onConfirm={() => confirmMutation.mutate()}
            canCancelRequest={canCancelRequest}
            isCanceling={isCancelPending}
            onCancelRequest={() => setIsCancelModalOpen(true)}
          />
        }
      />

      <EstimateRequestCancelConfirmModal
        open={isCancelModalOpen}
        isPending={isCancelPending}
        onClose={closeCancelModal}
        onConfirm={() => {
          if (isCancelPending) {
            return;
          }
          cancelMutation.mutate();
        }}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}

/**
 * 대기 견적 상세 Desktop (Figma 8091:47263)
 * // 2026.07.25 정슬기 - [추가]
 * // 2026.07.30 정슬기 - [수정] useEstimateDetail·Layout·Actions 통합
 * // 2026.08.03 정슬기 - [수정] 레이아웃·코멘트·요청 취소 액션
 */
export default function PendingEstimateDetailView({ estimateId }: PendingEstimateDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useEstimateDetail(estimateId);

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

  return <PendingEstimateDetailContent estimateId={estimateId} data={data} />;
}
