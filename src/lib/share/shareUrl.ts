/** 브라우저 현재 페이지 URL. SSR에서는 null */
export function getCurrentPageShareUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location.href;
}
