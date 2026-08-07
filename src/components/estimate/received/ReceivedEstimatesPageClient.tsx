"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import { ReceivedEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ReceivedEstimatesList from "@/components/estimate/received/ReceivedEstimatesList";
import { useReceivedEstimates } from "@/hooks/useReceivedEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";

export default function ReceivedEstimatesPageClient() {
  const { data, isError, error, isFetching, isPending, refetch } = useReceivedEstimates();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasData = data !== undefined;
  const showInitialSkeleton = isPending && !hasData;
  const showBlockingError = isError && !hasData;
  const showRefetchError = isError && hasData;
  const isEmpty =
    !showInitialSkeleton && !showBlockingError && Array.isArray(data) && data.length === 0;

  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-col items-center",
        !isEmpty && "py-38 md:py-32 xl:py-64",
      )}
    >
      {showInitialSkeleton ? <ReceivedEstimatesLoadingSkeleton /> : null}

      {showBlockingError ? (
        <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow w-full xl:px-0">
          <EstimatesQueryStatus
            message={getApiErrorMessage(error, "받은 견적을 불러오지 못했습니다.")}
            actionLabel={isFetching ? "다시 시도 중..." : "다시 시도"}
            actionBusy={isFetching}
            onAction={() => {
              void refetch();
            }}
            className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] border-0 px-20 py-40 shadow-none md:border-[0.5px] md:px-40 md:py-56"
          />
        </div>
      ) : null}

      {hasData ? (
        <>
          {showRefetchError ? (
            <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow w-full pb-24 xl:px-0">
              <EstimatesQueryStatus
                message={getApiErrorMessage(error, "최신 받은 견적을 다시 불러오지 못했습니다.")}
                actionLabel={isFetching ? "다시 시도 중..." : "다시 시도"}
                actionBusy={isFetching}
                onAction={() => {
                  void refetch();
                }}
                className="bg-background-default md:bg-background-surface md:rounded-20 md:border-border-subtle md:shadow-[-2px_-2px_10px_0_rgba(220,220,220,0.14),2px_2px_10px_0_rgba(220,220,220,0.14)] border-0 px-20 py-24 shadow-none md:border-[0.5px] md:px-28 md:py-28"
              />
            </div>
          ) : null}

          <ReceivedEstimatesList panels={data} onFavoriteError={setToastMessage} />
        </>
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
