"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import { PendingEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import {
  ESTIMATE_STATUS_PANEL_CLASSNAME,
  ESTIMATE_STATUS_PANEL_COMPACT_CLASSNAME,
} from "@/components/estimate/estimateSurfaceStyles";
import PendingEstimatesList from "@/components/estimate/pending/PendingEstimatesList";
import { usePendingEstimateSections } from "@/hooks/usePendingEstimateSections";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

export default function PendingEstimatesPageClient() {
  const { data, isError, error, isFetching, isLoading, refetch } = usePendingEstimateSections();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasData = data !== undefined;
  const showInitialSkeleton = isLoading && !hasData;
  const showBlockingError = isError && !hasData;
  const showRefetchError = isError && hasData;

  return (
    <div className="bg-background-default md:bg-background-subtle flex w-full flex-1 flex-col items-center">
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
              className={ESTIMATE_STATUS_PANEL_CLASSNAME}
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
                  className={ESTIMATE_STATUS_PANEL_COMPACT_CLASSNAME}
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
