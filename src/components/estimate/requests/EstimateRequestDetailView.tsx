"use client";

import Link from "next/link";
import { useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import EstimateDetailLayout, {
  ESTIMATE_DETAIL_LAYOUT_CLASSES,
  EstimateDetailQueryState,
} from "@/components/estimate/detail/EstimateDetailLayout";
import { EstimateDetailInfoSection } from "@/components/estimate/detail/EstimateDetailInfoSection";
import EstimateDetailShare from "@/components/estimate/detail/EstimateDetailShare";
import EstimateRequestDesignatedMovers from "@/components/estimate/requests/EstimateRequestDesignatedMovers";
import EstimateRequestDetailSummary from "@/components/estimate/requests/EstimateRequestDetailSummary";
import { useEstimateRequestDetail } from "@/hooks/useEstimateRequestDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { toKakaoShareImageUrl } from "@/lib/kakao/shareCustom";
import { buildEstimateShareLine } from "@/lib/share/copy";
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
 * Header/Hero/InfoRow/Share는 견적 상세 공통 재사용.
 * 기사님용 EstimateRequestSummaryContent(카드/모달)는 건드리지 않음.
 * // 2026.07.30 정슬기 - [수정] EstimateDetailLayout 적용
 * // 2026.07.30 정슬기 - [추가] 지정 요청 대상 기사님 정보 표시
 */
export default function EstimateRequestDetailView({
  estimateRequestId,
}: EstimateRequestDetailViewProps) {
  const { data, isLoading, isError, error, refetch } = useEstimateRequestDetail(estimateRequestId);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
  const kakaoEstimateShare = {
    share_line: buildEstimateShareLine(null),
    profile_image: toKakaoShareImageUrl(null),
    like_count: "",
  };

  return (
    <>
      <EstimateDetailLayout
        title="견적 상세"
        showProfile={false}
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
        aside={
          <EstimateDetailShare
            linkAccess="owner"
            kakaoEstimateShare={kakaoEstimateShare}
            onToastMessage={setToastMessage}
          />
        }
      />
      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
