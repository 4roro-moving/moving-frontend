"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * 서버 렌더링과 클라이언트 렌더링을 구분해야 할 때 사용하는 훅
 * (예: document/window에 의존하는 Portal, matchMedia 등)
 *
 * useEffect + setState 조합 대신 useSyncExternalStore를 사용해
 * "마운트 이후 setState" 안티패턴(react-hooks/set-state-in-effect)을 피합니다.
 */
export function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
