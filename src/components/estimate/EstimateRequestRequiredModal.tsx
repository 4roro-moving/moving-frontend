"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/common/Modal/Modal";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const PANEL_CLASSNAME = [
  "items-stretch text-left",
  "rounded-24 md:rounded-32",
  "w-full max-w-[292px] gap-30 px-16 py-24",
  "md:max-w-[608px] md:gap-40 md:px-24 md:pt-32 md:pb-40",
].join(" ");

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

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose} className={PANEL_CLASSNAME}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>
          지정 견적 요청하기
        </Modal.Title>
        <Modal.Close onClose={onClose} />
      </div>
      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        <Modal.Desc variant="2lg-medium">일반 견적 요청을 먼저 진행해 주세요.</Modal.Desc>
        <Modal.Button
          fullWidth
          size="cta"
          className="md:hidden"
          onClick={handleGoToEstimateRequest}
        >
          일반 견적 요청 하기
        </Modal.Button>
        <Modal.Button
          fullWidth
          size="detail"
          className="hidden md:inline-flex"
          onClick={handleGoToEstimateRequest}
        >
          일반 견적 요청 하기
        </Modal.Button>
      </div>
    </Modal>
  );
}
