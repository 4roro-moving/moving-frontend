"use client";

import { useRouter } from "next/navigation";

import AlertModal from "@/components/common/Modal/AlertModal";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface DesignateSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DesignateSuccessModal({ open, onClose }: DesignateSuccessModalProps) {
  const router = useRouter();

  const handleGoToEstimates = () => {
    onClose();
    router.push(APP_ROUTES.ESTIMATES.REQUESTS);
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title="지정 견적 요청 완료"
      description="지정 견적 요청이 완료되었습니다."
      primaryAction={{ label: "지정 견적서 보러가기", onClick: handleGoToEstimates }}
    />
  );
}
