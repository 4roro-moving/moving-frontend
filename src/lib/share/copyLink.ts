/**
 * 공유 링크 클립보드 복사
 * // 2026.07.30 정슬기 - [추가]
 */
export async function copyShareLink(url: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  // Clipboard API 미지원 시 최소 fallback
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
