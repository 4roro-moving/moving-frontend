"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils/cn";
import { TOAST_EXIT_DURATION_MS, toastMotionClassName } from "@/lib/utils/uiMotion";

const TOAST_DURATION_MS = 3000;

export interface ToastProps {
  children: ReactNode;
  /** 표시 시간 종료·exit 모션 후 호출 (부모가 목록에서 이 토스트를 제거) */
  onClose: () => void;
}

/**
 * 공통 Toast
 * - 사용: `{message ? <Toast onClose={...}>{message}</Toast> : null}`
 * // 2026.08.07 정슬기 - [수정] 퇴장 모션 후 onClose
 */
const Toast = ({ children, onClose }: ToastProps) => {
  const [open, setOpen] = useState(true);
  const { isRendered, isVisible } = usePresence(open, TOAST_EXIT_DURATION_MS);
  const onCloseRef = useRef(onClose);
  const hadRenderedRef = useRef(false);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isRendered) {
      hadRenderedRef.current = true;
      return;
    }
    if (hadRenderedRef.current && !open) {
      hadRenderedRef.current = false;
      onCloseRef.current();
    }
  }, [isRendered, open]);

  if (!isRendered) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[9999] flex justify-center",
        "top-70 xl:top-103",
        "px-8 md:px-52 xl:px-0",
      )}
    >
      <div
        className={cn(
          "bg-toast-background text-toast-text pointer-events-auto flex w-full items-center",
          "shadow-toast",
          "rounded-12 max-w-[360px] px-24 py-14",
          "md:max-w-[640px]",
          "xl:max-w-container-desktop xl:rounded-16 xl:px-32 xl:py-20",
          toastMotionClassName(isVisible),
        )}
      >
        <Text
          as="p"
          variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
          className="text-toast-text"
        >
          {children}
        </Text>
      </div>
    </div>
  );
};

export default Toast;
