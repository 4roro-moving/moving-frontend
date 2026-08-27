/**
 * Next/Image `remotePatterns` · 프로필 URL resolve가 공유하는 원격 이미지 허용 규칙.
 *
 * - 기본: 백엔드 seed용 picsum (S3 도입 전 임시)
 * - 추가: NEXT_PUBLIC_PROFILE_IMAGE_HOSTS (콤마 구분, S3/CloudFront)
 * - 경로: NEXT_PUBLIC_PROFILE_IMAGE_PATHNAME (콤마 구분, 선택, 기본 /**)
 *
 * @example
 * NEXT_PUBLIC_PROFILE_IMAGE_HOSTS=d1234abcd.cloudfront.net
 * NEXT_PUBLIC_PROFILE_IMAGE_PATHNAME=/profiles/**,/giveaways/**
 */
export interface AllowedImageRemotePattern {
  protocol: "https";
  hostname: string;
  pathname: string;
}

/** S3 연동 전 seed 이미지용. CDN 안정화 후 제거해도 됨 */
const DEFAULT_SEED_IMAGE_HOSTS = ["picsum.photos", "fastly.picsum.photos"] as const;

const DEFAULT_IMAGE_PATHNAME = "/**";

const parseCommaSeparatedList = (raw: string): string[] => {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizePathnamePattern = (raw: string): string => {
  return raw.startsWith("/") ? raw : `/${raw}`;
};

const getAllowedHostnames = (): string[] => {
  const fromEnv = parseCommaSeparatedList(process.env.NEXT_PUBLIC_PROFILE_IMAGE_HOSTS ?? "");
  return [...new Set([...DEFAULT_SEED_IMAGE_HOSTS, ...fromEnv])];
};

const getAllowedPathnames = (): string[] => {
  const fromEnv = parseCommaSeparatedList(process.env.NEXT_PUBLIC_PROFILE_IMAGE_PATHNAME ?? "");
  if (fromEnv.length === 0) {
    return [DEFAULT_IMAGE_PATHNAME];
  }

  return [...new Set(fromEnv.map((pathname) => normalizePathnamePattern(pathname)))];
};

/** next.config images.remotePatterns용 */
export const getAllowedImageRemotePatterns = (): AllowedImageRemotePattern[] => {
  const pathnames = getAllowedPathnames();

  return getAllowedHostnames().flatMap((hostname) =>
    pathnames.map((pathname) => ({
      protocol: "https" as const,
      hostname,
      pathname,
    })),
  );
};

function matchesPathnamePattern(urlPathname: string, pattern: string): boolean {
  if (pattern === "/**" || pattern === "*") {
    return true;
  }

  const prefix = pattern.replace(/\/\*\*$/, "").replace(/\*$/, "");
  if (!prefix || prefix === "/") {
    return true;
  }

  return urlPathname === prefix || urlPathname.startsWith(`${prefix}/`);
}

/** getAllowedImageSrc · Next/Image remote URL 허용 여부 */
export const isAllowedImageRemoteUrl = (src: string): boolean => {
  try {
    const url = new URL(src);
    if (url.protocol !== "https:") {
      return false;
    }

    return getAllowedImageRemotePatterns().some(
      (pattern) =>
        pattern.hostname === url.hostname && matchesPathnamePattern(url.pathname, pattern.pathname),
    );
  } catch {
    return false;
  }
};
