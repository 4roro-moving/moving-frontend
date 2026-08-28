"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const CHAT_MODAL_SEARCH_PARAM = "chat";
const CHAT_MODAL_SEARCH_VALUE = "open";

/**
 * 견적 상세 페이지 진입 시 채팅 모달 자동 open query를 처리합니다.
 * // 2026.08.13 김성현 - [추가] 알림 클릭 후 견적 상세에서 채팅 모달 자동 열림 처리
 */
export function useChatModalSearchParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isChatOpenRequested = searchParams.get(CHAT_MODAL_SEARCH_PARAM) === CHAT_MODAL_SEARCH_VALUE;

  const clearChatOpenSearchParam = useCallback(() => {
    if (!searchParams.has(CHAT_MODAL_SEARCH_PARAM)) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams.toString());
    nextSearchParams.delete(CHAT_MODAL_SEARCH_PARAM);
    const nextSearch = nextSearchParams.toString();

    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
  }, [pathname, router, searchParams]);

  return {
    isChatOpenRequested,
    clearChatOpenSearchParam,
  };
}
