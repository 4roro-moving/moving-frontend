function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/** OG·공유 링크용 앱 베이스 URL. NEXT_PUBLIC_APP_URL 필수 */
export function getAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (!fromEnv) {
    throw new Error("NEXT_PUBLIC_APP_URL 환경 변수가 필요합니다.");
  }

  return normalizeBaseUrl(fromEnv);
}

/** 상대 경로를 앱 기준 절대 URL로 변환 */
export function toAbsoluteAppUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}
