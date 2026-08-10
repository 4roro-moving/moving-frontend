"use client";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/Modal/AlertModal";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { markInternalDetailNavigation } from "@/lib/utils/detailNavigation";

interface DesignateSuccessModalProps {
  open: boolean;
  estimateRequestId: number | null;
  onClose: () => void;
}

export default function DesignateSuccessModal({
  open,
  estimateRequestId,
  onClose,
}: DesignateSuccessModalProps) {
  const router = useRouter();

  const handleGoToEstimates = () => {
    if (estimateRequestId === null) {
      return;
    }

    const detailHref = APP_ROUTES.ESTIMATES.REQUEST_DETAIL(estimateRequestId);
    onClose();
    markInternalDetailNavigation(detailHref);
    router.push(detailHref);
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title="지정 견적 요청 완료"
      description="지정 견적 요청이 완료되었습니다."
      primaryAction={{
        label: "지정 견적서 보러가기",
        onClick: handleGoToEstimates,
        disabled: estimateRequestId === null,
      }}
    />
  );
}
