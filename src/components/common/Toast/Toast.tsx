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
 * toast
 * - Desktop: 1200×66, top 103, rounded-16, px-32 py-20, 2lg-semibold
 * - Tablet: 640×54, top 70, inset 52, rounded-12, px-24 py-14, lg-semibold
 * - Mobile: 360×54, top 70, inset 8, rounded-12, px-24 py-14, lg-semibold
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
        "top-70 lg:top-103",
        "px-8 md:px-52 lg:px-0",
      )}
    >
      <div
        className={cn(
          "bg-toast-background text-toast-text pointer-events-auto flex w-full items-center",
          "shadow-toast",
          "rounded-12 max-w-[360px] px-24 py-14",
          "md:max-w-[640px]",
          "lg:max-w-container-desktop lg:rounded-16 lg:px-32 lg:py-20",
        )}
      >
        <Text
          as="p"
          variant={{ base: "lg-semibold", lg: "2lg-semibold" }}
          className="text-toast-text"
        >
          {children}
        </Text>
      </div>
    </div>
  );
};

export default Toast;
