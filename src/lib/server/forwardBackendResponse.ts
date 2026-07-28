import { NextResponse } from "next/server";

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

  for (const cookie of setCookies) {
    res.headers.append("Set-Cookie", rewriteSetCookiePathForApp(cookie));
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

/** 브라우저 → Next 요청의 Origin/Cookie를 백엔드로 전달 (CSRF·refresh cookie) */
export const buildBackendHeaders = (request: Request, init?: HeadersInit): Headers => {
  const headers = new Headers(init);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const origin = request.headers.get("origin");
  if (origin) {
    headers.set("Origin", origin);
  }

  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("Cookie", cookie);
  }

  return headers;
};
