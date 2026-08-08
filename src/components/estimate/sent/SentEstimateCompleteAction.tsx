"use client";

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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const completeMutation = useCompleteSentEstimate(estimateId);

  const handleComplete = async () => {
    try {
      await completeMutation.mutateAsync();
      setIsConfirmOpen(false);
      setToastMessage("이사 완료 처리되었습니다.");
    } catch (error) {
      setToastMessage(getApiErrorMessage(error, "이사 완료 처리하지 못했습니다."));
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
        이사 완료
      </Button>

      <AlertModal
        open={isConfirmOpen}
        title="이사를 완료하셨나요?"
        description="완료 처리하면 고객님이 리뷰를 작성할 수 있으며 이전 상태로 되돌릴 수 없습니다."
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
              돌아가기
            </Button>
            <Button
              size="cta"
              fullWidth
              disabled={completeMutation.isPending}
              aria-busy={completeMutation.isPending}
              onClick={() => void handleComplete()}
            >
              {completeMutation.isPending ? "완료 처리 중..." : "이사 완료"}
            </Button>
          </div>
        }
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
