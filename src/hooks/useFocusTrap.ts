"use client";

import { useEffect, type RefObject } from "react";

import { getFocusableElements } from "@/lib/utils/focusable";

interface UseFocusTrapOptions {
  containerRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
  onEscape?: () => void;
}

/**
 * 컨테이너 마운트 시 첫 포커스 가능 요소로 이동하고,
 * Tab을 컨테이너 안으로 가둡니다. Escape는 onEscape로 위임합니다.
 */
export function useFocusTrap({
  containerRef,
  enabled = true,
  onEscape,
}: UseFocusTrapOptions): void {
  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape?.();
        return;
      }

      if (event.key !== "Tab" || !containerRef.current) return;

      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        containerRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !containerRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (active === last || !containerRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const focusable = getFocusableElements(containerRef.current);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        containerRef.current.focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [containerRef, enabled, onEscape]);
}
