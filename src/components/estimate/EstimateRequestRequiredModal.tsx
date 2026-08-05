"use client";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/Modal/AlertModal";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface EstimateRequestRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 지정 견적 요청 시 진행 중인 일반 견적 요청이 없을 때 안내
 */
export default function EstimateRequestRequiredModal({
  open,
  onClose,
}: EstimateRequestRequiredModalProps) {
  const router = useRouter();

  const handleGoToEstimateRequest = () => {
    onClose();
    router.push(APP_ROUTES.ESTIMATE_REQUEST);
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title="지정 견적 요청하기"
      description="일반 견적 요청을 먼저 진행해 주세요."
      primaryAction={{ label: "일반 견적 요청 하기", onClick: handleGoToEstimateRequest }}
    />
  );
}
