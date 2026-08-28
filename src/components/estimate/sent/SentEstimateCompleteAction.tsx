"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import AlertModal from "@/components/common/Modal/AlertModal";
import Toast from "@/components/common/Toast/Toast";
import { useCompleteSentEstimate } from "@/hooks/useSentEstimates";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface SentEstimateCompleteActionProps {
  estimateId: number;
}

export default function SentEstimateCompleteAction({
  estimateId,
}: SentEstimateCompleteActionProps) {
  const t = useTranslations("estimates");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const completeMutation = useCompleteSentEstimate(estimateId);

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync();
      setIsConfirmOpen(false);
      setToastMessage(t("sent.completeSuccess"));
    } catch (error) {
      setToastMessage(getApiErrorMessage(error, t("sent.completeFailed")));
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="detail"
        fullWidth
        className="self-center md:w-3/4"
        disabled={completeMutation.isPending}
        onClick={() => setIsConfirmOpen(true)}
      >
        {t("sent.complete")}
      </Button>

      <AlertModal
        open={isConfirmOpen}
        title={t("sent.completeConfirmTitle")}
        description={t("sent.completeConfirmDescription")}
        onClose={() => setIsConfirmOpen(false)}
        closeDisabled={completeMutation.isPending}
        actions={
          <div className="flex w-full flex-col-reverse gap-12 md:flex-row">
            <Button
              variant="outline"
              size="cta"
              fullWidth
              disabled={completeMutation.isPending}
              onClick={() => setIsConfirmOpen(false)}
            >
              {t("requests.goBack")}
            </Button>
            <Button
              size="cta"
              fullWidth
              disabled={completeMutation.isPending}
              aria-busy={completeMutation.isPending}
              onClick={() => void handleComplete()}
            >
              {completeMutation.isPending ? t("sent.completing") : t("sent.complete")}
            </Button>
          </div>
        }
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
