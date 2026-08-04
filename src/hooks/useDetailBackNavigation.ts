"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * 상세 목록 이동: 항상 fallback 목록 경로로 replace 이동
 * // 2026.08.03 정슬기- [추가]
 */
export function useDetailBackNavigation(fallbackHref: string) {
  const router = useRouter();

  return useCallback(() => {
    router.replace(fallbackHref);
  }, [fallbackHref, router]);
}
