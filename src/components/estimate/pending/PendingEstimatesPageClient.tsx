"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import PendingEstimatesList from "@/components/estimate/pending/PendingEstimatesList";
import { usePendingEstimateSections } from "@/hooks/usePendingEstimateSections";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

// 2026.07.25 정슬기 - [추가] 대기 중 견적 목록 Page Client
// 2026.07.28 정슬기 - [수정] GET /estimates/pending 실 API 연동
// 2026.07.30 정슬기 - [수정] usePendingEstimateSections·EstimatesQueryStatus·배경 토큰 정렬
export default function PendingEstimatesPageClient() {
  const { data, isLoading, isError, error, refetch } = usePendingEstimateSections();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="bg-background-default md:bg-background-subtle flex w-full flex-col items-center">
      {isLoading ? <EstimatesQueryStatus message="대기 중인 견적을 불러오는 중입니다." /> : null}

      {isError ? (
        <EstimatesQueryStatus
          message={getApiErrorMessage(error, "대기 중인 견적을 불러오지 못했습니다.")}
          actionLabel="다시 시도"
          onAction={() => {
            void refetch();
          }}
        />
      ) : null}

      {!isLoading && !isError && data ? (
        <PendingEstimatesList
          sections={data.sections}
          onFavoriteError={setToastMessage}
          onConfirmError={setToastMessage}
          onConfirmSuccess={() => setToastMessage("견적이 확정되었습니다.")}
        />
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
