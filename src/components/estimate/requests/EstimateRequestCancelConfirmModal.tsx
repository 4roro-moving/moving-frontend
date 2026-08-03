"use client";

import Modal from "@/components/common/Modal/Modal";
import { cn } from "@/lib/utils/cn";

const PANEL_CLASSNAME = cn(
  "items-stretch text-left",
  "rounded-24 md:rounded-32",
  "w-full max-w-[292px] gap-30 px-16 py-24",
  "md:max-w-[480px] md:gap-40 md:px-24 md:pt-32 md:pb-40",
);

export interface EstimateRequestCancelConfirmModalProps {
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 보낸 견적 요청 취소 확인
 * // 2026.08.03 정슬기 - [추가]
 */
export default function EstimateRequestCancelConfirmModal({
  open,
  isPending = false,
  onClose,
  onConfirm,
}: EstimateRequestCancelConfirmModalProps) {
  if (!open) {
    return null;
  }

  // pending 중 ESC/overlay 닫기 방지 — FavoriteMoversDeleteConfirmModal과 동일
  return (
    <Modal onClose={isPending ? undefined : onClose} className={PANEL_CLASSNAME}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>
          견적 요청을 취소하시겠어요?
        </Modal.Title>
        <Modal.Close onClose={onClose} disabled={isPending} />
      </div>

      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        <Modal.Desc variant="2lg-medium">
          견적 요청을 취소하면 받은 견적도 함께 취소되며 더 이상 진행할 수 없습니다.
        </Modal.Desc>

        <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
          <Modal.Button
            type="button"
            variant="outline"
            size="cta"
            fullWidth
            disabled={isPending}
            onClick={onClose}
            className="md:flex-1"
          >
            돌아가기
          </Modal.Button>
          <Modal.Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            disabled={isPending}
            onClick={onConfirm}
            className="bg-status-error hover:bg-status-error/90 disabled:bg-background-disabled md:flex-1"
          >
            {isPending ? "취소 중..." : "견적 요청 취소"}
          </Modal.Button>
        </div>
      </div>
    </Modal>
  );
}
