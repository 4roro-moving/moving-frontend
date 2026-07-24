"use client";

import { type ReactNode, useEffect, useRef } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  onConfirm?: () => void;
  onClose: () => void;
  className?: string;
  overlayClassName?: string;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hidden &&
      element.getAttribute("aria-hidden") !== "true" &&
      !("disabled" in element && (element as HTMLButtonElement).disabled),
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * 공통 모달 틀
 * - 좌측 상단 타이틀 / 우측 상단 닫기(X)
 * - 중앙 children 영역
 * - 하단 주황색(브랜드) 확인 버튼
 */
export default function Modal({
  open,
  title,
  children,
  confirmLabel = "선택완료",
  confirmDisabled = false,
  onConfirm,
  onClose,
  className,
  overlayClassName,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      if (!dialogRef.current) return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialogRef.current.focus();
      }
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={cn(
        "bg-overlay-scrim fixed inset-0 z-50 flex items-center justify-center px-24",
        overlayClassName,
      )}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "bg-background-surface rounded-32 flex w-full max-w-[608px] flex-col gap-40 overflow-hidden px-24 pt-32 pb-40 shadow-[4px_4px_5px_0_rgba(169,169,169,0.20)]",
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-16">
          <Text as="h2" variant="2xl-semibold" className="text-text-primary">
            {title}
          </Text>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex size-36 shrink-0 items-center justify-center"
          >
            <CloseIcon className="text-icon-subtle" />
          </button>
        </div>

        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">{children}</div>

        <button
          type="button"
          disabled={confirmDisabled}
          onClick={onConfirm}
          className={cn(
            "rounded-16 flex h-64 w-full shrink-0 items-center justify-center px-16 transition-colors",
            confirmDisabled
              ? "bg-background-disabled cursor-not-allowed"
              : "bg-background-brand hover:bg-background-brand-hover",
          )}
        >
          <Text as="span" variant="2lg-semibold" className="text-text-inverse">
            {confirmLabel}
          </Text>
        </button>
      </div>
    </div>
  );
}
