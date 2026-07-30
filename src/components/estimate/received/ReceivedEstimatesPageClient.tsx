"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReceivedEstimatesList from "@/components/estimate/received/ReceivedEstimatesList";
import { useReceivedEstimates } from "@/hooks/useReceivedEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";

export default function ReceivedEstimatesPageClient() {
  // 2026.07.24 정슬기 - [추가] 받은 견적 목록 API 연동 (Mock 제거)
  const { data, isLoading, isError, error, refetch } = useReceivedEstimates();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 2026.07.29 정슬기 - [수정] Empty는 EstimatesListEmptyState가 세로 여백을 담당 — 페이지 py 중복 제거
  const isEmpty = !isLoading && !isError && Array.isArray(data) && data.length === 0;

  // 2026.07.24 정슬기 - [수정] Mobile 배경을 Figma처럼 default로 맞춰 카드가 튀지 않게 함 (md+는 기존 subtle 유지)
  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-col items-center",
        !isEmpty && "py-38 md:py-32 lg:py-64",
      )}
    >
      {isLoading ? <EstimatesQueryStatus message="받은 견적을 불러오는 중입니다." /> : null}

      {isError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(error, "받은 견적을 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && data ? (
        <ReceivedEstimatesList panels={data} onFavoriteError={setToastMessage} />
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
