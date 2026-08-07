"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const TOAST_DURATION_MS = 3000;

export interface ToastProps {
  children: ReactNode;
  /** 3초 후 자동으로 호출됨 (부모가 목록에서 이 토스트를 제거하는 용도) */
  onClose: () => void;
}

/**
 * 공통 Toast
 * - 사용: `{message ? <Toast onClose={...}>{message}</Toast> : null}`
 */
const Toast = ({ children, onClose }: ToastProps) => {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

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
