"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateRequestCancelConfirmModal from "@/components/estimate/requests/EstimateRequestCancelConfirmModal";
import EstimateRequestDesignatedMovers from "@/components/estimate/requests/EstimateRequestDesignatedMovers";
import EstimateRequestDetailSummary from "@/components/estimate/requests/EstimateRequestDetailSummary";
import { ESTIMATE_REQUEST_CANCELED_TOAST_KEY } from "@/components/estimate/requests/estimateRequestCancelToast";
import { useCancelEstimateRequest } from "@/hooks/useCancelEstimateRequest";
import { useEstimateRequestDetail } from "@/hooks/useEstimateRequestDetail";
import { TrashIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import {
  formatDetailDateLabel,
  formatMoveDateLabel,
  getEstimateRequestStatusLabel,
  getEstimateRequestStatusTextClassName,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import { ApiError } from "@/types/api";
import type { EstimateRequestStatus, MyEstimateRequestItem } from "@/types/estimate";

interface EstimateRequestDetailViewProps {
  estimateRequestId: number;
}

/** 고객이 soft cancel 가능한 요청 상태 */
// 2026.08.03 정슬기 - [추가]
function isCancelableEstimateRequestStatus(status: EstimateRequestStatus): boolean {
  return status === "PENDING" || status === "OPEN";
}

/**
 * Figma 견적 상세(8093:49323) 정보 행 adapter.
 * 표시: 요청일·서비스·이용일·출발지·도착지
 * 지정 요청 대상 기사님은 EstimateRequestDesignatedMovers에서 별도 표시
 */
function toRequestInfoRows(request: MyEstimateRequestItem) {
  return [
    { label: "견적 요청일", value: formatDetailDateLabel(request.createdAt) },
    { label: "서비스", value: getMoveTypeLabel(request.moveType) },
    { label: "이용일", value: formatMoveDateLabel(request.moveDate) },
    { label: "출발지", value: request.fromAddress },
    { label: "도착지", value: request.toAddress },
  ];
}

function toStatusPresentation(request: MyEstimateRequestItem) {
  // 체크 아이콘은 CONFIRMED(확정견적)만 — COMPLETED(이사 완료)는 라벨만
  const showConfirmedIcon = request.status === "CONFIRMED";
  const statusLabel =
    request.status === "CONFIRMED" ? "확정견적" : getEstimateRequestStatusLabel(request.status);
  const statusClassName = getEstimateRequestStatusTextClassName(request.status);

  return { statusLabel, showConfirmedIcon, statusClassName };
}

/**
 * 고객 보낸 견적 요청 상세
 *
 * Figma `견적 상세_확정 견적/Desktop`(8093:49323) 기준.
 * Header/Hero/InfoRow는 견적 상세 공통 재사용.
 * 기사님용 EstimateRequestSummaryContent(카드/모달)는 건드리지 않음.
 * // 2026.07.30 정슬기 - [수정] EstimateDetailLayout 적용
 * // 2026.07.30 정슬기 - [추가] 지정 요청 대상 기사님 정보 표시
 * // 2026.08.03 정슬기 - [추가] PENDING|OPEN 취소(쓰레기통) 액션
 */
export default function EstimateRequestDetailView({
  estimateRequestId,
}: EstimateRequestDetailViewProps) {
  const router = useRouter();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useEstimateRequestDetail(estimateRequestId);

  const closeCancelModal = useCallback(() => {
    setIsCancelModalOpen(false);
    // 닫힌 뒤 쓰레기통 버튼으로 focus 복귀
    queueMicrotask(() => {
      cancelButtonRef.current?.focus();
    });
  }, []);

  const cancelMutation = useCancelEstimateRequest(estimateRequestId, {
    onSuccess: () => {
      setIsCancelModalOpen(false);
      // 목록 이동 후에도 Toast를 보이도록 one-shot 플래그 전달
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

  if (isLoading) {
    return (
      <EstimateDetailQueryState title="견적 상세" message="견적 요청 상세를 불러오는 중입니다." />
    );
  }

  if (isError || !data) {
    const status = error instanceof ApiError ? error.status : undefined;
    const fallback =
      status === 404
        ? "견적 요청을 찾을 수 없습니다."
        : status === 403
          ? "이 견적 요청에 접근할 권한이 없습니다."
          : "견적 요청 상세를 불러오지 못했습니다.";

    return (
      <EstimateDetailQueryState
        title="견적 상세"
        message={getApiErrorMessage(error, fallback)}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
        secondaryAction={
          <div className="flex w-full justify-center pb-40">
            <Link
              href={APP_ROUTES.ESTIMATES.REQUESTS}
              className="text-text-brand focus-visible:ring-border-brand rounded-4 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
            >
              <Text as="span" variant="md-semibold" className="text-text-brand">
                목록으로 돌아가기
              </Text>
            </Link>
          </div>
        }
      />
    );
  }

  const isDesignated = data.designatedMovers.length > 0;
  const { statusLabel, showConfirmedIcon, statusClassName } = toStatusPresentation(data);
  const canCancel = isCancelableEstimateRequestStatus(data.status);
  const isCancelPending = cancelMutation.isPending;

  const headerActions = canCancel ? (
    <button
      ref={cancelButtonRef}
      type="button"
      aria-label="견적 요청 취소"
      aria-busy={isCancelPending}
      disabled={isCancelPending}
      onClick={() => setIsCancelModalOpen(true)}
      className={cn(
        "text-icon-default rounded-8 flex size-44 shrink-0 items-center justify-center",
        "hover:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      <TrashIcon className="size-24" />
    </button>
  ) : null;

  return (
    <>
      <EstimateDetailLayout
        title="견적 상세"
        showProfile={false}
        headerActions={headerActions}
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
        asideClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.asideClassName}
        main={
          <>
            <EstimateRequestDetailSummary
              moveType={data.moveType}
              isDesignated={isDesignated}
              title={getMoveTypeLabel(data.moveType)}
              statusLabel={statusLabel}
              statusClassName={statusClassName}
              showConfirmedIcon={showConfirmedIcon}
            />
            <EstimateDetailInfoSection rows={toRequestInfoRows(data)} />
            <EstimateRequestDesignatedMovers designatedMovers={data.designatedMovers} />
          </>
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
