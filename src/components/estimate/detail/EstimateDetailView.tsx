"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimateDetailActions from "@/components/estimate/detail/EstimateDetailActions";
import EstimateDetailComment from "@/components/estimate/detail/EstimateDetailComment";
import EstimateDetailDriverSummary from "@/components/estimate/detail/EstimateDetailDriverSummary";
import EstimateDetailInfo from "@/components/estimate/detail/EstimateDetailInfo";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailLoadingState,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import EstimateDetailNotice from "@/components/estimate/detail/EstimateDetailNotice";
import EstimateDetailPrice from "@/components/estimate/detail/EstimateDetailPrice";
import EstimateRequestCancelConfirmModal from "@/components/estimate/requests/EstimateRequestCancelConfirmModal";
import { useConfirmEstimate } from "@/hooks/useConfirmEstimate";
import { useEstimateDetail } from "@/hooks/useEstimateDetail";
import { useEstimateRequestCancelFlow } from "@/hooks/useEstimateRequestCancelFlow";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { isCancelableEstimateRequestStatus } from "@/lib/utils/estimateFormat";
import { ApiError } from "@/types/api";
import type { EstimateDetail } from "@/types/estimate";

interface EstimateDetailViewProps {
  estimateId: number;
}

interface EstimateDetailContentProps {
  estimateId: number;
  data: EstimateDetail;
  statusBanner?: ReactNode;
}

function EstimateDetailContent({ estimateId, data, statusBanner }: EstimateDetailContentProps) {
  const [confirmToastMessage, setConfirmToastMessage] = useState<string | null>(null);

  const estimateRequestId = data.estimateRequest.id;
  const canCancelRequest = isCancelableEstimateRequestStatus(data.estimateRequest.status);
  const isConfirmed = data.isConfirmed;
  const displayName = data.mover.nickname || data.mover.name;

  const confirmMutation = useConfirmEstimate(estimateId, {
    onSuccess: () => setConfirmToastMessage("견적이 확정되었어요."),
    onError: setConfirmToastMessage,
  });

  const cancelFlow = useEstimateRequestCancelFlow(estimateRequestId);
  const toastMessage = confirmToastMessage ?? cancelFlow.toastMessage;

  return (
    <>
      <EstimateDetailLayout
        heroImageUrl={data.mover.imageUrl}
        heroName={displayName}
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "xl:pt-40")}
        backFallbackHref={APP_ROUTES.ESTIMATES.RECEIVED}
        statusBanner={statusBanner}
        main={
          <>
            <div className="flex w-full flex-col gap-20 md:gap-26">
              <EstimateDetailDriverSummary detail={data} onFavoriteError={setConfirmToastMessage} />
              <EstimateDetailPrice price={data.price} />
            </div>
            <div className="flex w-full flex-col gap-20 md:gap-28">
              <EstimateDetailInfo detail={data} />
              {data.comment.trim() ? (
                <div className="border-border-subtle w-full border-t" aria-hidden="true" />
              ) : null}
            </div>
            <EstimateDetailComment comment={data.comment} />
            {!isConfirmed ? <EstimateDetailNotice /> : null}
          </>
        }
        aside={
          !isConfirmed ? (
            <EstimateDetailActions
              isConfirmed={data.isConfirmed}
              canConfirm={data.canConfirm}
              confirmDisabledReason={data.confirmDisabledReason}
              isConfirming={confirmMutation.isPending}
              onConfirm={() => confirmMutation.mutate()}
              canCancelRequest={canCancelRequest}
              isCanceling={cancelFlow.isCancelPending}
              onCancelRequest={cancelFlow.openCancelModal}
              cancelButtonRef={cancelFlow.cancelButtonRef}
              buttonSize="detail"
            />
          ) : undefined
        }
      />

      <EstimateRequestCancelConfirmModal
        open={cancelFlow.isCancelModalOpen}
        isPending={cancelFlow.isCancelPending}
        onClose={cancelFlow.closeCancelModal}
        onConfirm={cancelFlow.confirmCancel}
      />

      {toastMessage ? (
        <Toast
          onClose={() => {
            setConfirmToastMessage(null);
            cancelFlow.clearToast();
          }}
        >
          {toastMessage}
        </Toast>
      ) : null}
    </>
  );
}

export default function EstimateDetailView({ estimateId }: EstimateDetailViewProps) {
  const { data, isError, error, isFetching, isLoading, refetch } = useEstimateDetail(estimateId);
  const hasData = data !== undefined;
  const showInitialSkeleton = isLoading && !hasData;
  const showBlockingError = isError && !hasData;
  const showRefetchError = isError && hasData;
  const fallbackMessage = "견적 상세를 불러오지 못했어요.";
  const isNotFound = error instanceof ApiError && error.status === 404;
  const blockingMessage = isNotFound
    ? "존재하지 않거나 더 이상 확인할 수 없는 견적입니다."
    : getApiErrorMessage(error, fallbackMessage);

  if (showInitialSkeleton) {
    return (
      <EstimateDetailLoadingState
        backFallbackHref={APP_ROUTES.ESTIMATES.RECEIVED}
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        asideClassName={cn(ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName, "xl:pt-40")}
      />
    );
  }

  if (showBlockingError || !data) {
    return (
      <EstimateDetailQueryState
        message={blockingMessage}
        actionLabel={isNotFound ? undefined : "다시 시도"}
        onAction={() => {
          void refetch();
        }}
        actionBusy={isFetching}
        backFallbackHref={APP_ROUTES.ESTIMATES.RECEIVED}
        className="min-h-320"
      />
    );
  }

  return (
    <EstimateDetailContent
      estimateId={estimateId}
      data={data}
      statusBanner={
        showRefetchError ? (
          <div
            className="border-error text-text-error rounded-16 border bg-red-100 px-16 py-12"
            role="status"
            aria-live="polite"
          >
            {getApiErrorMessage(error, fallbackMessage)}
          </div>
        ) : undefined
      }
    />
  );
}
