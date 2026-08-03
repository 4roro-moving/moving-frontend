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

import { useFocusTrap } from "@/hooks/useFocusTrap";
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
  /** modal: 중앙 / bottom-sheet: 하단 / responsive: 모바일 하단, 태블릿 이상 중앙 */
  presentation?: "modal" | "bottom-sheet" | "responsive";
  /** sm: 293px / md: 375px / lg: 모바일 full → 태블릿 375px → 데스크톱 608px */
  size?: "sm" | "md" | "lg";
  className?: string;
  overlayClassName?: string;
  /** Modal.Title 없이 접근성 라벨이 필요할 때 사용 */
  "aria-label"?: string;
}

const ModalMain = ({
  children,
  onClose,
  presentation = "modal",
  size,
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
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, []);

  useFocusTrap({
    containerRef: panelRef,
    enabled: isMounted,
    onEscape: onClose,
  });

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
          presentation === "bottom-sheet" && "items-end px-0",
          presentation === "responsive" && "items-end px-0 md:items-center md:px-24",
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
            presentation === "bottom-sheet" && "rounded-t-32 w-full max-w-none rounded-b-none",
            presentation === "responsive" &&
              "rounded-t-32 md:rounded-32 w-full max-w-none rounded-b-none",
            size === "sm" && "w-full max-w-[293px]",
            size === "md" &&
              (presentation === "responsive"
                ? "md:w-[375px] md:max-w-[375px]"
                : "w-full max-w-[375px]"),
            size === "lg" &&
              (presentation === "responsive"
                ? "md:w-[375px] md:max-w-[375px] xl:w-full xl:max-w-[608px]"
                : "w-full max-w-[608px]"),
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
