"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Toast from "@/components/common/Toast/Toast";
import { ReceivedEstimatesLoadingSkeleton } from "@/components/estimate/EstimateLoadingSkeletons";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import {
  ESTIMATE_STATUS_PANEL_CLASSNAME,
  ESTIMATE_STATUS_PANEL_COMPACT_CLASSNAME,
} from "@/components/estimate/estimateSurfaceStyles";
import ReceivedEstimatesList from "@/components/estimate/received/ReceivedEstimatesList";
import { useReceivedEstimates } from "@/hooks/useReceivedEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";

export default function ReceivedEstimatesPageClient() {
  const t = useTranslations("estimates");
  const { data, isError, error, isFetching, isLoading, refetch } = useReceivedEstimates();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hasData = data !== undefined;
  const showInitialSkeleton = isLoading && !hasData;
  const showBlockingError = isError && !hasData;
  const showRefetchError = isError && hasData;
  const isEmpty =
    !showInitialSkeleton && !showBlockingError && Array.isArray(data) && data.length === 0;

  return (
    <div
      className={cn(
        "bg-background-default md:bg-background-subtle flex w-full flex-1 flex-col items-center",
        !isEmpty && "py-38 md:py-32 xl:py-64",
      )}
    >
      {showInitialSkeleton ? <ReceivedEstimatesLoadingSkeleton /> : null}

      {showBlockingError ? (
        <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow w-full xl:px-0">
          <EstimatesQueryStatus
            message={getApiErrorMessage(error, t("receivedLoadFailed"))}
            actionLabel={isFetching ? t("retrying") : t("retry")}
            actionBusy={isFetching}
            onAction={() => {
              void refetch();
            }}
            className={ESTIMATE_STATUS_PANEL_CLASSNAME}
          />
        </div>
      ) : null}

      {hasData ? (
        <>
          {showRefetchError ? (
            <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow w-full pb-24 xl:px-0">
              <EstimatesQueryStatus
                message={getApiErrorMessage(error, t("receivedRefreshFailed"))}
                actionLabel={isFetching ? t("retrying") : t("retry")}
                actionBusy={isFetching}
                onAction={() => {
                  void refetch();
                }}
                className={ESTIMATE_STATUS_PANEL_COMPACT_CLASSNAME}
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
