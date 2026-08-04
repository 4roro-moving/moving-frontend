"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * 상세 뒤로가기 — 이력이 있으면 back, 없으면 fallback 목록으로 이동
 * // 2026.08.03 정슬기 - [추가]
 */
export function useDetailBackNavigation(fallbackHref: string) {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }, [fallbackHref, router]);
}
