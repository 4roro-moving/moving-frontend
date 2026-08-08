"use client";

import { useEffect, useState } from "react";

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface PresenceState {
  open: boolean;
  isRendered: boolean;
  isVisible: boolean;
}

/**
 * open이 false여도 durationMs 동안 마운트를 유지해 exit 애니메이션을 재생한다.
 * // 2026.08.07 정슬기 - [추가]
 */
export function usePresence(open: boolean, durationMs: number) {
  const [presence, setPresence] = useState<PresenceState>({
    open,
    isRendered: open,
    isVisible: open,
  });

  // props 변화에 맞춰 presence를 동기화 (렌더 중 setState — React 권장 패턴)
  if (open !== presence.open) {
    if (open) {
      setPresence({ open: true, isRendered: true, isVisible: true });
    } else {
      setPresence({ open: false, isRendered: true, isVisible: false });
    }
  }

  useEffect(() => {
    if (presence.open || presence.isVisible) {
      return;
    }

    const delayMs = prefersReducedMotion() ? 0 : durationMs;
    const timeoutId = window.setTimeout(() => {
      setPresence((prev) => {
        if (prev.open || prev.isVisible) {
          return prev;
        }
        return { ...prev, isRendered: false };
      });
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [presence.open, presence.isVisible, durationMs]);

  return {
    isRendered: presence.isRendered,
    isVisible: presence.isVisible,
  };
}
