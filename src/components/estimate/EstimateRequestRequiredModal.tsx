"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("estimates");
  const router = useRouter();

  const handleGoToEstimateRequest = () => {
    onClose();
    router.push(APP_ROUTES.ESTIMATE_REQUEST);
  };

  return (
    <AlertModal
      open={open}
      onClose={onClose}
      title={t("designatedRequestTitle")}
      description={t("designatedRequestDescription")}
      primaryAction={{ label: t("goToRequest"), onClick: handleGoToEstimateRequest }}
    />
  );
}
