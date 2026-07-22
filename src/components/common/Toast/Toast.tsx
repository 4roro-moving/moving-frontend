"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { Text } from "@/components/common/Text";

const TOAST_DURATION_MS = 3000 * 60;

export interface ToastProps {
  children: ReactNode;
  /** 3초 후 자동으로 호출됨 (부모가 목록에서 이 토스트를 제거하는 용도) */
  onClose: () => void;
}

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
      className="fixed top-20 left-1/2 z-[9999] w-full -translate-x-1/2"
    >
      <div className="rounded-16 flex w-full items-center bg-[var(--toast-background)] px-32 py-20 text-[var(--toast-text)]">
        <Text variant="sm-medium">{children}</Text>
      </div>
    </div>
  );
};

export default Toast;
