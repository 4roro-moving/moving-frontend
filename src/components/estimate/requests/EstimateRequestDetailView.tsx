"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { RefObject } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import DesignatedMoverCancelConfirmModal from "@/components/estimate/requests/DesignatedMoverCancelConfirmModal";
import EstimateRequestCancelConfirmModal from "@/components/estimate/requests/EstimateRequestCancelConfirmModal";
import EstimateRequestCancelHubModal from "@/components/estimate/requests/EstimateRequestCancelHubModal";
import EstimateRequestDesignatedMovers from "@/components/estimate/requests/EstimateRequestDesignatedMovers";
import EstimateRequestDetailSummary from "@/components/estimate/requests/EstimateRequestDetailSummary";
import { EstimateRequestDetailSkeleton } from "@/components/estimate/requests/EstimateRequestLoadingSkeletons";
import { useEstimateRequestCancelHubFlow } from "@/hooks/useEstimateRequestCancelHubFlow";
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
function toRequestInfoRows(
  request: MyEstimateRequestItem,
  locale: string,
  labels: {
    requestedAt: string;
    service: string;
    useDate: string;
    fromAddress: string;
    toAddress: string;
  },
) {
  const formatAddress = (address: string, detailAddress: string | null) =>
    [address, detailAddress].filter(Boolean).join(" ");

  return [
    { label: labels.requestedAt, value: formatDetailDateLabel(request.createdAt) },
    { label: labels.service, value: getMoveTypeLabel(request.moveType, locale) },
    { label: labels.useDate, value: formatMoveDateLabel(request.moveDate, locale) },
    {
      label: labels.fromAddress,
      value: formatAddress(request.fromAddress, request.fromDetailAddress),
    },
    { label: labels.toAddress, value: formatAddress(request.toAddress, request.toDetailAddress) },
  ];
}

function toStatusPresentation(
  request: MyEstimateRequestItem,
  locale: string,
  confirmedLabel: string,
) {
  const showConfirmedIcon = request.status === "CONFIRMED";
  const statusLabel =
    request.status === "CONFIRMED"
      ? confirmedLabel
      : getEstimateRequestStatusLabel(request.status, locale);
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
  ariaLabel,
  label,
}: {
  cancelButtonRef: RefObject<HTMLButtonElement | null>;
  isCancelPending: boolean;
  onCancel: () => void;
  ariaLabel: string;
  label: string;
}) {
  return (
    <button
      ref={cancelButtonRef}
      type="button"
      aria-label={ariaLabel}
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
        {label}
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
 * // 2026.08.07 정슬기 - [수정] 취소 허브에서 지정·전체 취소 선택 후 확인 모달
 */
export default function EstimateRequestDetailView({
  estimateRequestId,
}: EstimateRequestDetailViewProps) {
  const t = useTranslations("estimates");
  const locale = useLocale();
  const { data, isLoading, isError, error, refetch } = useEstimateRequestDetail(estimateRequestId);
  // 훅은 로딩 중에도 호출 — designatedMovers는 data 없을 때 빈 배열
  const cancelHub = useEstimateRequestCancelHubFlow(
    estimateRequestId,
    data?.designatedMovers ?? [],
  );

  if (isLoading) {
    return <EstimateRequestDetailSkeleton />;
  }

  if (isError || !data) {
    const status = error instanceof ApiError ? error.status : undefined;
    const fallback =
      status === 404
        ? t("requests.notFound")
        : status === 403
          ? t("requests.forbidden")
          : t("requests.detailLoadFailed");

    return (
      <EstimateDetailQueryState
        title={t("detail.title")}
        message={getApiErrorMessage(error, fallback)}
        actionLabel={t("retry")}
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
                {t("requests.backToList")}
              </Text>
            </Link>
          </div>
        }
      />
    );
  }

  const isDesignated = data.designatedMovers.length > 0;
  const { statusLabel, showConfirmedIcon, statusClassName } = toStatusPresentation(
    data,
    locale,
    t("detail.confirmedStatus"),
  );
  const canCancel = isCancelableEstimateRequestStatus(data.status);

  return (
    <>
      <EstimateDetailLayout
        title={t("detail.title")}
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
              title={getMoveTypeLabel(data.moveType, locale)}
              statusLabel={statusLabel}
              statusClassName={statusClassName}
              showConfirmedIcon={showConfirmedIcon}
            />
            <EstimateDetailInfoSection
              rows={toRequestInfoRows(data, locale, {
                requestedAt: t("detail.requestedAt"),
                service: t("detail.service"),
                useDate: t("detail.useDate"),
                fromAddress: t("fromAddress"),
                toAddress: t("toAddress"),
              })}
            />
            <EstimateRequestDesignatedMovers designatedMovers={data.designatedMovers} />
            {canCancel ? (
              <EstimateRequestCancelAction
                cancelButtonRef={cancelHub.cancelButtonRef}
                isCancelPending={cancelHub.isBusy}
                onCancel={cancelHub.openHub}
                ariaLabel={t("requests.cancelActionAria")}
                label={t("requests.cancelAction")}
              />
            ) : null}
          </>
        }
      />

      <EstimateRequestCancelHubModal
        open={cancelHub.isHubOpen}
        designatedMovers={data.designatedMovers}
        closeDisabled={cancelHub.isBusy}
        onClose={cancelHub.closeAll}
        onSelectDesignateCancel={cancelHub.openDesignateConfirm}
        onSelectFullCancel={cancelHub.openFullConfirm}
      />

      <DesignatedMoverCancelConfirmModal
        open={cancelHub.isDesignateConfirmOpen}
        moverDisplayName={cancelHub.designateDisplayName}
        isPending={cancelHub.isDesignateCancelPending}
        onClose={cancelHub.closeConfirmBackToHub}
        onConfirm={cancelHub.confirmDesignateCancel}
      />

      <EstimateRequestCancelConfirmModal
        open={cancelHub.isFullConfirmOpen}
        isPending={cancelHub.isFullCancelPending}
        onClose={cancelHub.closeConfirmBackToHub}
        onConfirm={cancelHub.confirmFullCancel}
      />

      {cancelHub.toastMessage ? (
        <Toast onClose={cancelHub.clearToast}>{cancelHub.toastMessage}</Toast>
      ) : null}
    </>
  );
}
