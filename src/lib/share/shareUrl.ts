export type ShareLinkAccess = "public" | "owner";

/** 브라우저 현재 페이지 URL. SSR에서는 null */
export function getCurrentPageShareUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location.href;
}

export function getOwnerOnlyShareNotice(): string {
  return "견적 상세는 요청하신 고객 계정으로 로그인한 경우에만 확인할 수 있어요.";
}
