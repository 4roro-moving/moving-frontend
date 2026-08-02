"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

import Modal from "@/components/common/Modal/Modal";

export type AlertModalSize = "md" | "sm";

export interface AlertPrimaryAction {
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface AlertModalProps {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  /** true면 Escape / overlay 클릭으로 닫히지 않음 */
  closeDisabled?: boolean;
  /** md: 608px, sm: 480px (모바일 292px 공통) */
  size?: AlertModalSize;
  /**
   * 단일 주요 CTA (Mobile cta / Desktop detail).
   * `actions`가 있으면 무시됩니다.
   */
  primaryAction?: AlertPrimaryAction;
  /** 커스텀 액션 영역. 있으면 primaryAction보다 우선합니다. */
  actions?: ReactNode;
}

function alertPanelClassName(size: AlertModalSize = "md"): string {
  return cn(
    "items-stretch text-left",
    "rounded-24 md:rounded-32",
    "w-full max-w-[292px] gap-30 px-16 py-24",
    "md:gap-40 md:px-24 md:pt-32 md:pb-40",
    size === "sm" ? "md:max-w-[480px]" : "md:max-w-[608px]",
  );
}

function AlertPrimaryActionButtons({ label, onClick, disabled = false }: AlertPrimaryAction) {
  return (
    <>
      <Modal.Button
        fullWidth
        size="cta"
        className="md:hidden"
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Modal.Button>
      <Modal.Button
        fullWidth
        size="detail"
        className="hidden md:inline-flex"
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Modal.Button>
    </>
  );
}

/**
 * 안내/확인용 Alert 모달 preset.
 * - 기본: title + description + primaryAction
 * - 예외: actions로 버튼 영역 직접 구성 (있으면 primaryAction 무시)
 */
export default function AlertModal({
  open,
  title,
  description,
  onClose,
  closeDisabled = false,
  size = "md",
  primaryAction,
  actions,
}: AlertModalProps) {
  if (!open) {
    return null;
  }

  const actionContent =
    actions ?? (primaryAction ? <AlertPrimaryActionButtons {...primaryAction} /> : null);

  return (
    <Modal onClose={closeDisabled ? undefined : onClose} className={alertPanelClassName(size)}>
      <div className="flex w-full items-center justify-between gap-12">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>{title}</Modal.Title>
        <Modal.Close onClose={onClose} disabled={closeDisabled} />
      </div>

      <div className="flex w-full flex-col items-stretch gap-30 md:gap-40">
        {description != null ? <Modal.Desc variant="2lg-medium">{description}</Modal.Desc> : null}
        {actionContent}
      </div>
    </Modal>
  );
}
