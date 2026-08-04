"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import {
  clearInternalDetailNavigation,
  hasInternalDetailNavigation,
} from "@/lib/utils/detailNavigation";

/**
 * 서비스 내부에서 상세로 진입했으면 back, 아니면 fallback 목록으로 replace 이동
 * // 2026.08.03 정슬기- [추가]
 */
export function useDetailBackNavigation(fallbackHref: string) {
  const pathname = usePathname();
  const router = useRouter();
  const isInternalEntryRef = useRef(pathname ? hasInternalDetailNavigation(pathname) : false);

  useEffect(() => {
    if (!pathname) {
      isInternalEntryRef.current = false;
      return;
    }

    isInternalEntryRef.current = hasInternalDetailNavigation(pathname);

    return () => {
      clearInternalDetailNavigation(pathname);
    };
  }, [pathname]);

  return useCallback(() => {
    if (pathname && isInternalEntryRef.current) {
      clearInternalDetailNavigation(pathname);
      router.back();
      return;
    }

    if (pathname) {
      clearInternalDetailNavigation(pathname);
    }

    router.replace(fallbackHref);
  }, [fallbackHref, pathname, router]);
}
