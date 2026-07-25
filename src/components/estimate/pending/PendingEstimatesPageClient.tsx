"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import PendingEstimatesList from "@/components/estimate/pending/PendingEstimatesList";
import ReceivedEstimatesStatus from "@/components/estimate/received/ReceivedEstimatesStatus";
import { useMyEstimateRequests } from "@/hooks/useMyEstimateRequests";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

// 2026.07.25 정슬기 - [추가] 대기 중 견적 목록 Page Client (service → mock)
export default function PendingEstimatesPageClient() {
  const { data, isLoading, isError, error, refetch } = useMyEstimateRequests();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="bg-background-subtle flex w-full flex-col items-center">
      {isLoading ? <ReceivedEstimatesStatus message="대기 중인 견적을 불러오는 중입니다." /> : null}

      {isError ? (
        <ReceivedEstimatesStatus
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
