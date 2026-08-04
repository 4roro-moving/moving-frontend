"use client";

import { useSyncExternalStore } from "react";

function subscribe(query: string, callback: () => void) {
  const mediaQueryList = window.matchMedia(query);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getSnapshot(query: string) {
  return window.matchMedia(query).matches;
}

// 서버에는 window가 없으므로 항상 false를 반환합니다.
// 클라이언트에서 실제 매치 여부로 다시 렌더링되며 hydration mismatch는 발생하지 않습니다
// (React가 서버 렌더 결과와 클라이언트 첫 렌더 결과를 동일하게 취급하도록 useSyncExternalStore가 보장)
function getServerSnapshot() {
  return false;
}

/**
 * 미디어 쿼리 매치 여부를 구독하는 훅입니다.
 * @param query 예: "(min-width: 1280px)". MEDIA_QUERY 상수 사용을 권장합니다.
 *
 * @example
 * const isDesktop = useMediaQuery(MEDIA_QUERY.xl);
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => subscribe(query, callback),
    () => getSnapshot(query),
    getServerSnapshot,
  );
}
