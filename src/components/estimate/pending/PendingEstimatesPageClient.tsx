"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import { PendingEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import PendingEstimatesList from "@/components/estimate/pending/PendingEstimatesList";
import { usePendingEstimateSections } from "@/hooks/usePendingEstimateSections";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

export default function PendingEstimatesPageClient() {
  const { data, isError, error, isFetching, isPending, refetch } = usePendingEstimateSections();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasData = data !== undefined;
  const showInitialSkeleton = isPending && !hasData;
  const showBlockingError = isError && !hasData;
  const showRefetchError = isError && hasData;

  return (
    <div className="bg-background-default md:bg-background-subtle flex w-full flex-col items-center">
      {showInitialSkeleton ? <PendingEstimatesLoadingSkeleton /> : null}

      {showBlockingError ? (
        <div className="bg-background-subtle px-margin-mobile md:px-margin-tablet flex w-full justify-center pt-35 pb-64 md:pt-42 md:pb-80 xl:px-0 xl:pt-78 xl:pb-80">
          <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop w-full">
            <EstimatesQueryStatus
              message={getApiErrorMessage(error, "대기 중인 견적을 불러오지 못했습니다.")}
              actionLabel={isFetching ? "다시 시도 중..." : "다시 시도"}
              actionBusy={isFetching}
              onAction={() => {
                void refetch();
              }}
              className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] border-0 px-20 py-40 shadow-none md:border-[0.5px] md:px-40 md:py-56"
            />
          </div>
        </div>
      ) : null}

      {hasData ? (
        <>
          {showRefetchError ? (
            <div className="bg-background-subtle px-margin-mobile md:px-margin-tablet flex w-full justify-center pt-20 md:pt-24 xl:px-0">
              <div className="max-w-container-pending-mobile md:max-w-container-pending-tablet xl:max-w-container-pending-desktop w-full">
                <EstimatesQueryStatus
                  message={getApiErrorMessage(error, "최신 대기 견적을 다시 불러오지 못했습니다.")}
                  actionLabel={isFetching ? "다시 시도 중..." : "다시 시도"}
                  actionBusy={isFetching}
                  onAction={() => {
                    void refetch();
                  }}
                  className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] border-0 px-20 py-24 shadow-none md:border-[0.5px] md:px-28 md:py-28"
                />
              </div>
            </div>
          ) : null}

          <PendingEstimatesList
            sections={data.sections}
            onFavoriteError={setToastMessage}
            onConfirmError={setToastMessage}
            onConfirmSuccess={() => setToastMessage("견적이 확정되었어요.")}
          />
        </>
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
