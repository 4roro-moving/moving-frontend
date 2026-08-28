"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("estimates");
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
      title={t("designatedSuccessTitle")}
      description={t("designatedSuccessDescription")}
      primaryAction={{
        label: t("viewDesignatedEstimate"),
        onClick: handleGoToEstimates,
        disabled: estimateRequestId === null,
      }}
    />
  );
}
