"use client";

import { useEffect } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  durationMs?: number;
  className?: string;
}

/**
 * Figma Toast (node 1:1790)
 * - brand subtle 배경 + brand 테두리/텍스트
 * - 화면 상단 중앙 고정
 */
export default function Toast({
  open,
  message,
  onClose,
  durationMs = 3000,
  className,
}: ToastProps) {
  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);

    return () => window.clearTimeout(timer);
  }, [open, durationMs, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex justify-center px-24"
    >
      <div
        className={cn(
          "bg-background-brand-muted pointer-events-auto flex h-[60px] w-full max-w-[640px] items-center justify-center rounded-[16px] px-24 py-16 shadow-[4px_4px_5px_0_rgba(195,217,242,0.20)]",
          className,
        )}
      >
        <Text as="p" variant="2lg-semibold" className="text-text-brand text-center">
          {message}
        </Text>
      </div>
    </div>
  );
}
