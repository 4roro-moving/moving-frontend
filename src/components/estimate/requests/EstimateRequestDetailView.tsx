"use client";

import Link from "next/link";
import type { RefObject } from "react";

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
import { useEstimateRequestCancelFlow } from "@/hooks/useEstimateRequestCancelFlow";
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
  isCancelableEstimateRequestStatus,
} from "@/lib/utils/estimateFormat";
import { ApiError } from "@/types/api";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface EstimateRequestDetailViewProps {
  estimateRequestId: number;
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
 * 보낸 견적 요청 상세 — 취소 액션
 * aside(320px 고정폭) 대신 main 콘텐츠 하단에 배치.
 * 이 페이지는 aside에 프로필 카드 등 다른 콘텐츠가 없어 버튼 하나만
 * aside에 넣으면 Desktop에서 폭이 안 맞아 붕 떠 보이는 문제가 있었음.
 * // 2026.08.04 정슬기 - [추가]
 * // 2026.08.04 정슬기 - [수정] aside → main 하단으로 이동 (Desktop 레이아웃 오류 수정)
 */
function EstimateRequestCancelAction({
  cancelButtonRef,
  isCancelPending,
  onCancel,
}: {
  cancelButtonRef: RefObject<HTMLButtonElement | null>;
  isCancelPending: boolean;
  onCancel: () => void;
}) {
  return (
    <button
      ref={cancelButtonRef}
      type="button"
      aria-label="견적 요청 취소하기"
      aria-busy={isCancelPending}
      disabled={isCancelPending}
      onClick={onCancel}
      className={cn(
        // Tablet/Mobile 풀폭 액션 — detail CTA(h-64)와 동일 높이
        // Desktop main 컬럼(840px) 안에서도 동일하게 풀폭으로 자연스럽게 이어짐
        "border-border-default text-text-primary rounded-16 flex h-64 w-full items-center justify-center gap-8 border px-16",
        "hover:bg-background-hover",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      <TrashIcon className="size-24 shrink-0" aria-hidden="true" />
      <Text as="span" variant="lg-semibold" className="whitespace-nowrap">
        견적 요청 취소하기
      </Text>
    </button>
  );
}

/**
 * 고객 보낸 견적 요청 상세
 *
 * Figma `견적 상세_확정 견적/Desktop`(8093:49323) 기준.
 * Header/Hero/InfoRow는 견적 상세 공통 재사용.
 * 기사님용 EstimateRequestSummaryContent(카드/모달)는 건드리지 않음.
 * // 2026.07.30 정슬기 - [수정] EstimateDetailLayout 적용
 * // 2026.07.30 정슬기 - [추가] 지정 요청 대상 기사님 정보 표시
 * // 2026.08.03 정슬기 - [추가] PENDING|OPEN 취소 액션
 * // 2026.08.04 정슬기 - [수정] Header → 상세 액션 영역으로 취소 버튼 이동
 * // 2026.08.04 정슬기 - [수정] aside(320px 고정폭) → main 하단으로 이동
 */
export default function EstimateRequestDetailView({
  estimateRequestId,
}: EstimateRequestDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useEstimateRequestDetail(estimateRequestId);
  const cancelFlow = useEstimateRequestCancelFlow(estimateRequestId);

  if (isLoading) {
    return (
      <EstimateDetailQueryState
        title="견적 상세"
        message="견적 요청 상세를 불러오는 중입니다."
        backFallbackHref={APP_ROUTES.ESTIMATES.REQUESTS}
      />
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
        backFallbackHref={APP_ROUTES.ESTIMATES.REQUESTS}
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

  return (
    <>
      <EstimateDetailLayout
        title="견적 상세"
        showProfile={false}
        backFallbackHref={APP_ROUTES.ESTIMATES.REQUESTS}
        contentClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.contentClassName}
        rowClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.rowClassName}
        mainClassName={ESTIMATE_DETAIL_LAYOUT_CLASSES.mainClassName}
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
            {canCancel ? (
              <EstimateRequestCancelAction
                cancelButtonRef={cancelFlow.cancelButtonRef}
                isCancelPending={cancelFlow.isCancelPending}
                onCancel={cancelFlow.openCancelModal}
              />
            ) : null}
          </>
        }
      />

      <EstimateRequestCancelConfirmModal
        open={cancelFlow.isCancelModalOpen}
        isPending={cancelFlow.isCancelPending}
        onClose={cancelFlow.closeCancelModal}
        onConfirm={cancelFlow.confirmCancel}
      />

      {cancelFlow.toastMessage ? (
        <Toast onClose={cancelFlow.clearToast}>{cancelFlow.toastMessage}</Toast>
      ) : null}
    </>
  );
}
