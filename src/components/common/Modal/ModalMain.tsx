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

import { useCloseOnPathnameChange } from "@/hooks/useCloseOnPathnameChange";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useIsClient } from "@/hooks/useIsClient";
import { usePresence } from "@/hooks/usePresence";
import { cn } from "@/lib/utils/cn";

/** overlay/content exit 중 가장 긴 값 — usePresence 언마운트 지연 */
export const MODAL_EXIT_DURATION_MS = 180;

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
  /**
   * false면 exit 모션 후 언마운트.
   * 조건부 렌더(`{open && <Modal />}`)만 쓰면 exit가 생략되므로 open prop을 넘기세요.
   */
  open?: boolean;
  /** exit 모션이 끝난 뒤(언마운트 직전) 호출 */
  onExitComplete?: () => void;
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
  open = true,
  onExitComplete,
  presentation = "modal",
  size,
  className,
  overlayClassName,
  "aria-label": ariaLabel,
}: ModalMainProps) => {
  const isClient = useIsClient();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const onExitCompleteRef = useRef(onExitComplete);
  const hadRenderedRef = useRef(false);

  // Modal.Title / Modal.Desc가 마운트되면 스스로 등록해서, 실제로 쓰인 경우에만
  // dialog에 aria-labelledby / aria-describedby를 연결합니다.
  const [hasTitle, setHasTitle] = useState(false);
  const [hasDescription, setHasDescription] = useState(false);

  const { isRendered, isVisible } = usePresence(open, MODAL_EXIT_DURATION_MS);

  useEffect(() => {
    onExitCompleteRef.current = onExitComplete;
  }, [onExitComplete]);

  // 한 번이라도 열린 뒤에 완전히 닫혔을 때만 onExitComplete 호출 (초기 open=false는 제외)
  useEffect(() => {
    if (isRendered) {
      hadRenderedRef.current = true;
      return;
    }
    if (hadRenderedRef.current && !open) {
      hadRenderedRef.current = false;
      onExitCompleteRef.current?.();
    }
  }, [isRendered, open]);

  useCloseOnPathnameChange(isVisible ? onClose : undefined);

  useEffect(() => {
    if (!isRendered) {
      return;
    }

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
  }, [isRendered]);

  useFocusTrap({
    containerRef: panelRef,
    enabled: isClient && isRendered && isVisible,
    onEscape: isVisible ? onClose : undefined,
  });

  if (!isClient || !isRendered) return null;

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isVisible) return;
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  const overlayMotionClassName = isVisible
    ? "animate-modal-overlay-in motion-reduce:animate-none"
    : "animate-modal-overlay-out motion-reduce:animate-none";

  const panelMotionClassName = (() => {
    if (presentation === "bottom-sheet") {
      return isVisible
        ? "animate-modal-sheet-in motion-reduce:animate-none"
        : "animate-modal-sheet-out motion-reduce:animate-none";
    }
    if (presentation === "responsive") {
      return isVisible
        ? "animate-modal-sheet-in md:animate-modal-content-in motion-reduce:animate-none"
        : "animate-modal-sheet-out md:animate-modal-content-out motion-reduce:animate-none";
    }
    return isVisible
      ? "animate-modal-content-in motion-reduce:animate-none"
      : "animate-modal-content-out motion-reduce:animate-none";
  })();

  return createPortal(
    <ModalContext.Provider value={{ titleId, descriptionId, setHasTitle, setHasDescription }}>
      <div
        className={cn(
          "bg-overlay-scrim fixed inset-0 z-9999 flex items-center justify-center",
          overlayMotionClassName,
          !isVisible && "pointer-events-none",
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
          aria-hidden={!isVisible}
          aria-label={!hasTitle ? ariaLabel : undefined}
          aria-labelledby={hasTitle ? titleId : undefined}
          aria-describedby={hasDescription ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            "rounded-24 bg-background-surface relative flex flex-col items-center gap-40 p-40 shadow-lg focus:outline-none",
            panelMotionClassName,
            presentation === "bottom-sheet" && "rounded-t-32 w-full max-w-none rounded-b-none",
            presentation === "responsive" &&
              "rounded-t-32 md:rounded-32 w-full max-w-none rounded-b-none",
            size === "sm" && "w-full max-w-73.25",
            size === "md" &&
              (presentation === "responsive" ? "md:w-93.75 md:max-w-93.75" : "w-full max-w-93.75"),
            size === "lg" &&
              (presentation === "responsive"
                ? "md:w-93.75 md:max-w-93.75 xl:w-full xl:max-w-152"
                : "w-full max-w-152"),
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
