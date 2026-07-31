export type ShareLinkAccess = "public" | "owner";

/** 브라우저 현재 페이지 URL. SSR에서는 null */
export function getCurrentPageShareUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location.href;
}

/** 견적 상세(owner) 공유 섹션 인라인 안내 문구 */
export function getOwnerOnlyShareNotice(): string {
  return "공유한 링크는 견적 당사자 본인 계정으로 로그인한 경우에만 확인할 수 있어요.";
}
