import { NextResponse } from "next/server";

import { NICKNAME_STORAGE_KEY } from "@/lib/auth/nickname";
import {
  buildBackendHeaders,
  forwardBackendResponse,
  getBackendApiBaseUrl,
} from "@/lib/server/forwardBackendResponse";

const ALLOWED_PATHS = new Set(["login", "refresh", "logout", "signup/customer"]);
const BODY_PATHS = new Set(["login", "signup/customer"]);

/**
 * Auth BFF — 브라우저 same-origin 요청을 백엔드로 프록시하고 Set-Cookie를 재부착합니다.
 * 예: POST /api/auth/login, /api/auth/signup/customer
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
      res.cookies.set("refreshToken", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      res.cookies.set(NICKNAME_STORAGE_KEY, "", {
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: { message: "인증 요청에 실패했습니다." } },
      { status: 502 },
    );
  }
};
