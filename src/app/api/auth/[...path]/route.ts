import { NextResponse } from "next/server";

import { NICKNAME_STORAGE_KEY } from "@/lib/auth/nickname";
import { ROLE_STORAGE_KEY } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_BACKEND_PATH, REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";
import {
  buildBackendHeaders,
  forwardBackendResponse,
  getBackendApiBaseUrl,
} from "@/lib/server/forwardBackendResponse";

const ALLOWED_POST_PATHS = new Set([
  "login",
  "refresh",
  "logout",
  "signup/customer",
  "signup/mover",
  "oauth/google",
  "oauth/kakao",
  "oauth/naver",
]);

const ALLOWED_GET_PATHS = new Set(["oauth/naver/state"]);

const BODY_PATHS = new Set([
  "login",
  "signup/customer",
  "signup/mover",
  "oauth/google",
  "oauth/kakao",
  "oauth/naver",
]);

/** 새 세션 발급 경로 — 브라우저에 남은 폐기 refreshToken을 백엔드로 전달하지 않음 */
const STRIP_REFRESH_COOKIE_PATHS = new Set([
  "login",
  "signup/customer",
  "signup/mover",
  "oauth/google",
  "oauth/kakao",
  "oauth/naver",
]);

const isProduction = process.env.NODE_ENV === "production";

/**
 * Set-Cookie 삭제 헤더를 붙입니다.
 * 주의: 같은 응답에서 `res.cookies.set`을 쓰면 Next가 Set-Cookie를 재작성해
 * headers.append로 넣은 refreshToken 삭제가 사라질 수 있습니다. 전부 append만 사용합니다.
 */
const appendClearCookie = (
  res: NextResponse,
  name: string,
  path: string,
  options?: { httpOnly?: boolean; sameSite?: "Lax" | "None"; secure?: boolean },
): void => {
  const sameSite = options?.sameSite ?? "Lax";
  const secure = options?.secure ?? false;
  const httpOnly = options?.httpOnly ?? false;

  let value = `${name}=; Path=${path}; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${sameSite}`;
  if (httpOnly) value += "; HttpOnly";
  if (secure) value += "; Secure";

  res.headers.append("Set-Cookie", value);
};

/** login 시 심은 쿠키와 동일한 속성으로 지워야 브라우저가 삭제합니다. */
const clearClientAuthCookies = (res: NextResponse): void => {
  const refreshSameSite = isProduction ? "None" : "Lax";
  const refreshSecure = isProduction;

  for (const path of ["/", REFRESH_TOKEN_COOKIE_BACKEND_PATH]) {
    appendClearCookie(res, REFRESH_TOKEN_COOKIE_NAME, path, {
      httpOnly: true,
      sameSite: refreshSameSite,
      secure: refreshSecure,
    });
    // 속성 불일치로 남은 쿠키 대비 (dev에서 Secure/SameSite 조합이 달랐던 경우)
    appendClearCookie(res, REFRESH_TOKEN_COOKIE_NAME, path, {
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    });
  }

  appendClearCookie(res, NICKNAME_STORAGE_KEY, "/", { sameSite: "Lax" });
  appendClearCookie(res, ROLE_STORAGE_KEY, "/", { sameSite: "Lax" });
};

/**
 * Auth BFF — 브라우저 same-origin 요청을 백엔드로 프록시하고 Set-Cookie를 재부착합니다.
 */
export const POST = async (request: Request, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  const authPath = path.join("/");

  if (!ALLOWED_POST_PATHS.has(authPath)) {
    return NextResponse.json(
      { success: false, error: { message: "지원하지 않는 auth 요청입니다." } },
      { status: 404 },
    );
  }

  try {
    const body = BODY_PATHS.has(authPath) ? await request.text() : undefined;

    const backendRes = await fetch(`${getBackendApiBaseUrl()}/auth/${authPath}`, {
      method: "POST",
      headers: buildBackendHeaders(request, undefined, {
        stripRefreshToken: STRIP_REFRESH_COOKIE_PATHS.has(authPath),
      }),
      body,
      cache: "no-store",
    });

    const res = await forwardBackendResponse(backendRes);

    if (authPath === "logout") {
      clearClientAuthCookies(res);
    }

    return res;
  } catch {
    const res = NextResponse.json(
      { success: false, error: { message: "인증 요청에 실패했습니다." } },
      { status: 502 },
    );

    if (authPath === "logout") {
      clearClientAuthCookies(res);
    }

    return res;
  }
};

export const GET = async (request: Request, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  const authPath = path.join("/");

  if (!ALLOWED_GET_PATHS.has(authPath)) {
    return NextResponse.json(
      { success: false, error: { message: "지원하지 않는 auth 요청입니다." } },
      { status: 404 },
    );
  }

  try {
    const backendRes = await fetch(`${getBackendApiBaseUrl()}/auth/${authPath}`, {
      method: "GET",
      headers: buildBackendHeaders(request),
      cache: "no-store",
    });

    return forwardBackendResponse(backendRes);
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "인증 요청에 실패했습니다." } },
      { status: 502 },
    );
  }
};
