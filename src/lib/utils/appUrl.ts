function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, "");
}

/** Vercel이 주입하는 VERCEL_URL(호스트만)을 https 절대 URL로 변환 */
function fromVercelHost(raw: string): string {
  const host = raw.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return `https://${host}`;
}

/**
 * OG·공유 링크용 앱 베이스 URL.
 * NEXT_PUBLIC_APP_URL 우선, 없으면 Vercel 배포 호스트(VERCEL_URL)를 사용합니다.
 */
export function getAppBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (fromEnv) {
    return normalizeBaseUrl(fromEnv);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return fromVercelHost(vercelUrl);
  }

  throw new Error("NEXT_PUBLIC_APP_URL 환경 변수가 필요합니다.");
}

/** 상대 경로를 앱 기준 절대 URL로 변환 */
export function toAbsoluteAppUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getAppBaseUrl()}${normalizedPath}`;
}
