"use client";

import { useRouter } from "next/navigation";

import Modal from "@/components/common/Modal/Modal";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

const PANEL_CLASSNAME = cn(
  "items-stretch text-left",
  "rounded-24 md:rounded-32",
  "w-full max-w-[292px] gap-30 px-16 py-24",
  "md:max-w-[608px] md:gap-40 md:px-24 md:pt-32 md:pb-40",
);

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

  if (!open) {
    return null;
  }

  return (
    <Modal onClose={onClose} className={PANEL_CLASSNAME}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>
          지정 견적 요청 완료
        </Modal.Title>
        <Modal.Close onClose={onClose} />
      </div>
      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        <Modal.Desc variant="2lg-medium">지정 견적 요청이 완료되었습니다.</Modal.Desc>
        <Modal.Button fullWidth size="cta" className="md:hidden" onClick={handleGoToEstimates}>
          지정 견적서 보러가기
        </Modal.Button>
        <Modal.Button
          fullWidth
          size="detail"
          className="hidden md:inline-flex"
          onClick={handleGoToEstimates}
        >
          지정 견적서 보러가기
        </Modal.Button>
      </div>
    </Modal>
  );
}
