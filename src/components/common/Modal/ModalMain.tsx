"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils/cn";

interface ModalContextValue {
  titleId: string;
  descriptionId: string;
  setHasTitle: (hasTitle: boolean) => void;
  setHasDescription: (hasDescription: boolean) => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export interface ModalMainProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  overlayClassName?: string;
  /** Modal.Title 없이 접근성 라벨이 필요할 때 사용 */
  "aria-label"?: string;
}

const ModalMain = ({
  children,
  onClose,
  className,
  overlayClassName,
  "aria-label": ariaLabel,
}: ModalMainProps) => {
  const isMounted = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  // Modal.Title / Modal.Desc가 마운트되면 스스로 등록해서, 실제로 쓰인 경우에만
  // dialog에 aria-labelledby / aria-describedby를 연결합니다.
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

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
    <ModalContext.Provider value={{ titleId, descriptionId, setHasTitle, setHasDescription }}>
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
          aria-label={!hasTitle ? ariaLabel : undefined}
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            "rounded-24 bg-background-surface relative flex flex-col items-center gap-40 p-40 shadow-lg focus:outline-none",
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.body,
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal 컴포넌트 내에서만 사용 가능합니다.");
  }

  return context;
};

export { ModalMain };
