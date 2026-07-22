"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils/cn";

export interface ModalMainProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  overlayClassName?: string;
}

const ModalMain = ({ children, onClose, className, overlayClassName }: ModalMainProps) => {
  const isMounted = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    panelRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isMounted) return null;

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className={cn(
        "bg-overlay-scrim fixed inset-0 z-[9999] flex items-center justify-center",
        overlayClassName,
      )}
      onClick={handleOverlayClick}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className={cn(
          "rounded-8 bg-background-surface relative flex flex-col items-center gap-40 p-40 shadow-lg focus:outline-none",
          className,
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default ModalMain;
