import { NextResponse } from "next/server";

import { REFRESH_TOKEN_COOKIE_BACKEND_PATH, REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";

/**
 * 페이지(F5) 요청에도 쿠키가 실리도록 Path를 `/`로 맞춥니다.
 * 백엔드 Path=/api/auth 이면 document 요청에 쿠키가 안 실려 SSR이 비로그인으로 렌더됩니다.
 */
const rewriteSetCookiePathForApp = (setCookie: string): string => {
  if (/;\s*Path=/i.test(setCookie)) {
    return setCookie.replace(/;\s*Path=[^;]*/gi, "; Path=/");
  }
  return `${setCookie}; Path=/`;
};

const isRefreshTokenSetCookie = (setCookie: string): boolean => {
  const name = setCookie.split("=", 1)[0]?.trim();
  return name === REFRESH_TOKEN_COOKIE_NAME;
};

/** Path=/api/auth 에 남은 refreshToken을 제거해 Rotation 후 폐기 토큰 재전송을 막습니다. */
const clearRefreshTokenBackendPathCookie = (): string => {
  const isProduction = process.env.NODE_ENV === "production";
  const sameSite = isProduction ? "None" : "Lax";
  const securePart = isProduction ? "; Secure" : "";
  return `${REFRESH_TOKEN_COOKIE_NAME}=; Path=${REFRESH_TOKEN_COOKIE_BACKEND_PATH}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=${sameSite}${securePart}`;
};

/**
 * 백엔드 응답 JSON + Set-Cookie를 Next 응답으로 전달합니다.
 * 브라우저 기준 쿠키 host가 Next(프론트) origin이 됩니다.
 */
export const forwardBackendResponse = async (backendRes: Response): Promise<NextResponse> => {
  const body = await backendRes.text();
  const res = new NextResponse(body, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
    },
  });

  const setCookies =
    typeof backendRes.headers.getSetCookie === "function" ? backendRes.headers.getSetCookie() : [];

  let hasRefreshTokenCookie = false;
  for (const cookie of setCookies) {
    if (isRefreshTokenSetCookie(cookie)) {
      hasRefreshTokenCookie = true;
    }
    res.headers.append("Set-Cookie", rewriteSetCookiePathForApp(cookie));
  }

  if (hasRefreshTokenCookie) {
    res.headers.append("Set-Cookie", clearRefreshTokenBackendPathCookie());
  }

  return res;
};

/** Route Handler → 백엔드. 로컬에서는 NEXT_PUBLIC_API_BASE_URL과 동일 값 사용 */
export const getBackendApiBaseUrl = (): string => {
  const base =
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("API_BASE_URL 또는 NEXT_PUBLIC_API_BASE_URL이 필요합니다.");
  }
  return base.replace(/\/$/, "");
};

/** login/oauth 등 — 폐기된 refreshToken이 백엔드로 다시 실리지 않게 제거 */
export const stripRefreshTokenCookie = (cookieHeader: string | null): string | undefined => {
  if (!cookieHeader) return undefined;

  const kept = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter((part) => part && !part.startsWith(`${REFRESH_TOKEN_COOKIE_NAME}=`));

  return kept.length > 0 ? kept.join("; ") : undefined;
};

/** 브라우저 → Next 요청의 Origin/Cookie를 백엔드로 전달 (CSRF·refresh cookie) */
export const buildBackendHeaders = (
  request: Request,
  init?: HeadersInit,
  options?: { stripRefreshToken?: boolean },
): Headers => {
  const headers = new Headers(init);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    headers.set("Origin", origin);
  }

  const cookie = options?.stripRefreshToken
    ? stripRefreshTokenCookie(request.headers.get("cookie"))
    : (request.headers.get("cookie") ?? undefined);

  if (cookie) {
    headers.set("Cookie", cookie);
  }

  return headers;
};
