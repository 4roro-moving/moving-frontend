import { NextResponse } from "next/server";

import { NICKNAME_STORAGE_KEY } from "@/lib/auth/nickname";
import { ROLE_STORAGE_KEY } from "@/lib/auth/role";
import { REFRESH_TOKEN_COOKIE_BACKEND_PATH, REFRESH_TOKEN_COOKIE_NAME } from "@/lib/auth/token";
import {
  buildBackendHeaders,
  forwardBackendResponse,
  getBackendApiBaseUrl,
} from "@/lib/server/forwardBackendResponse";

const ALLOWED_PATHS = new Set(["login", "refresh", "logout", "signup/customer", "signup/mover"]);
const BODY_PATHS = new Set(["login", "signup/customer", "signup/mover"]);

const isProduction = process.env.NODE_ENV === "production";

/** login 시 심은 쿠키와 동일한 속성으로 지워야 브라우저가 삭제합니다. */
const clearClientAuthCookies = (res: NextResponse): void => {
  const refreshCookieBase = {
    httpOnly: true,
    maxAge: 0,
    expires: new Date(0),
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    secure: isProduction,
  };

  res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    ...refreshCookieBase,
    path: "/",
  });
  res.cookies.set(REFRESH_TOKEN_COOKIE_NAME, "", {
    ...refreshCookieBase,
    path: REFRESH_TOKEN_COOKIE_BACKEND_PATH,
  });
  res.cookies.set(NICKNAME_STORAGE_KEY, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax",
  });
  res.cookies.set(ROLE_STORAGE_KEY, "", {
    path: "/",
    maxAge: 0,
    expires: new Date(0),
    sameSite: "lax",
  });
};

/**
 * Auth BFF — 브라우저 same-origin 요청을 백엔드로 프록시하고 Set-Cookie를 재부착합니다.
 * 예: POST /api/auth/login, /api/auth/signup/customer, /api/auth/signup/mover
 */
export const POST = async (request: Request, context: { params: Promise<{ path: string[] }> }) => {
  const { path } = await context.params;
  const authPath = path.join("/");

  if (!ALLOWED_PATHS.has(authPath)) {
    return NextResponse.json(
      { success: false, error: { message: "지원하지 않는 auth 요청입니다." } },
      { status: 404 },
    );
  }

  try {
    const body = BODY_PATHS.has(authPath) ? await request.text() : undefined;

    const backendRes = await fetch(`${getBackendApiBaseUrl()}/auth/${authPath}`, {
      method: "POST",
      headers: buildBackendHeaders(request),
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

    // 백엔드 실패 시에도 클라이언트 쿠키는 정리
    if (authPath === "logout") {
      clearClientAuthCookies(res);
    }

    return res;
  }
};
