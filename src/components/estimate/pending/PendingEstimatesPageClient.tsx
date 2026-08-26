"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("estimates");
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
              message={getApiErrorMessage(error, t("pending.loadFailed"))}
              actionLabel={isFetching ? t("retrying") : t("retry")}
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
                  message={getApiErrorMessage(error, t("pending.refreshFailed"))}
                  actionLabel={isFetching ? t("retrying") : t("retry")}
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
            onConfirmSuccess={() => setToastMessage(t("detail.confirmSuccess"))}
          />
        </>
      ) : null}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}
