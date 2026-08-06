/**
 * 브라우저 공유 유틸 (클립보드·현재 URL)
 */

/** 브라우저 현재 페이지 URL. SSR에서는 null */
export function getCurrentPageShareUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.location.href;
}

/** 공유 링크 클립보드 복사 */
export async function copyShareLink(url: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("CLIPBOARD_UNAVAILABLE");
  }

  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!ok) {
    throw new Error("CLIPBOARD_COPY_FAILED");
  }
}
