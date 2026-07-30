"use client";

import { useState } from "react";
import Link from "next/link";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import EstimateDetailHeader from "@/components/estimate/detail/EstimateDetailHeader";
import EstimateDetailHero from "@/components/estimate/detail/EstimateDetailHero";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import EstimateRequestDetailSummary from "@/components/estimate/requests/EstimateRequestDetailSummary";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import { useEstimateRequestDetail } from "@/hooks/useEstimateRequestDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  formatDetailDateLabel,
  formatMoveDateLabel,
  getEstimateRequestStatusLabel,
  getEstimateRequestStatusTextClassName,
  getMoveTypeLabel,
} from "@/lib/utils/estimateFormat";
import { ApiError } from "@/types/api";
import type { MyEstimateRequestItem } from "@/types/estimate";

interface EstimateRequestDetailViewProps {
  estimateRequestId: number;
}

/**
 * Figma 견적 상세(8093:49323) 정보 행 adapter.
 * 표시: 요청일·서비스·이용일·출발지·도착지
 * 제외: 견적가(API 없음), 만료일·받은 견적 수·지정 텍스트 행·취소일(Figma 미요구, 지정은 칩)
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
  // 2026.07.30 정슬기 - [수정] COMPLETED에 확정 아이콘이 붙지 않도록 분리
  const showConfirmedIcon = request.status === "CONFIRMED";
  // Figma 확정 칩 문구 "확정견적" — 요청 CONFIRMED에 동일 표기
  const statusLabel =
    request.status === "CONFIRMED" ? "확정견적" : getEstimateRequestStatusLabel(request.status);
  // 이사 완료는 text-text-error(status-error), 그 외 brand
  // 2026.07.30 정슬기 - [수정] COMPLETED 배지 색상 분기
  const statusClassName = getEstimateRequestStatusTextClassName(request.status);

  return { statusLabel, showConfirmedIcon, statusClassName };
}

/**
 * 고객 보낸 견적 요청 상세
 *
 * Figma `견적 상세_확정 견적/Desktop`(8093:49323) 기준.
 * Header/Hero/InfoRow/Share는 견적 상세 공통 재사용.
 * 기사님용 EstimateRequestSummaryContent(카드/모달)는 건드리지 않음.
 * // 2026.07.30 정슬기 - [수정] Figma 상세 레이아웃·adapter props 정리
 */
export default function EstimateRequestDetailView({
  estimateRequestId,
}: EstimateRequestDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useEstimateRequestDetail(estimateRequestId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="bg-background-default flex w-full max-w-full flex-col overflow-x-hidden">
        <EstimateDetailHeader title="견적 상세" />
        <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center lg:px-0">
          <div className="max-w-container-desktop w-full">
            <ReceivedEstimatesStatus message="견적 요청 상세를 불러오는 중입니다." />
          </div>
        </div>
      </div>
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
      <div className="bg-background-default flex w-full max-w-full flex-col overflow-x-hidden">
        <EstimateDetailHeader title="견적 상세" />
        <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center lg:px-0">
          <div className="max-w-container-desktop w-full">
            <ReceivedEstimatesStatus
              message={getApiErrorMessage(error, fallback)}
              actionLabel="다시 시도"
              onAction={() => {
                void refetch();
              }}
            />
            <div className="flex w-full justify-center pb-40">
              <Link
                href="/estimates/requests"
                className="text-text-brand focus-visible:ring-border-brand rounded-4 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                <Text as="span" variant="md-semibold" className="text-text-brand">
                  목록으로 돌아가기
                </Text>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isDesignated = data.designatedMovers.length > 0;
  const { statusLabel, showConfirmedIcon, statusClassName } = toStatusPresentation(data);

  return (
    <div className="bg-background-default flex w-full max-w-full flex-col items-start overflow-x-hidden">
      <EstimateDetailHeader title="견적 상세" />
      {/* Figma 8093:49327 — 프로필 없는 주황 히어로 */}
      <EstimateDetailHero showProfile={false} />

      {/* Figma 8093:49343 — container 1200, content 740 + share 320, pb 150 */}
      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center pt-24 pb-64 md:pt-28 md:pb-80 lg:px-0 lg:pb-[150px]">
        <div className="max-w-container-desktop flex w-full flex-col items-stretch gap-32 md:gap-40 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex w-full min-w-0 flex-col gap-24 md:gap-30 lg:w-[740px]">
            <EstimateRequestDetailSummary
              moveType={data.moveType}
              isDesignated={isDesignated}
              title={getMoveTypeLabel(data.moveType)}
              statusLabel={statusLabel}
              statusClassName={statusClassName}
              showConfirmedIcon={showConfirmedIcon}
            />
            <EstimateDetailInfoSection rows={toRequestInfoRows(data)} />
          </div>

          <aside className="flex w-full min-w-0 flex-col items-start gap-28 md:gap-40 lg:w-[320px] lg:overflow-clip">
            <EstimateDetailShare onToastMessage={setToastMessage} />
          </aside>
        </div>
      </div>

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
