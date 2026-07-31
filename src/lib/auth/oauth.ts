import type { AuthAudience } from "@/lib/auth/redirect";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { ApiError } from "@/types/api";

export type OAuthProvider = "google" | "kakao" | "naver";

const OAUTH_PENDING_KEY = "moving_oauth_pending";
const OAUTH_STATE_KEY = "moving_oauth_state";

export interface OAuthPendingSession {
  provider: OAuthProvider;
  role: "CUSTOMER" | "MOVER";
  returnPath?: string | null;
}

interface OAuthAuthorizeConfig {
  authorizeUrl: string;
  clientId: string;
  scope?: string;
}

// 관리자는 포함 안됨
export const audienceToOAuthRole = (audience: AuthAudience): "CUSTOMER" | "MOVER" => {
  switch (audience) {
    case "mover":
      return "MOVER";
    case "customer":
      return "CUSTOMER";
    default:
      return "CUSTOMER";
  }
};

/** oauth 대기 세션 저장 */
export const saveOAuthPendingSession = (session: OAuthPendingSession): void => {
  sessionStorage.setItem(OAUTH_PENDING_KEY, JSON.stringify(session));
};

export const loadOAuthPendingSession = (): OAuthPendingSession | null => {
  const raw = sessionStorage.getItem(OAUTH_PENDING_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as OAuthPendingSession;
  } catch {
    return null;
  }
};

/** oauth 대기 세션 삭제 */
export const clearOAuthPendingSession = (): void => {
  sessionStorage.removeItem(OAUTH_PENDING_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);
};

export const saveOAuthClientState = (state: string): void => {
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
};

export const loadOAuthClientState = (): string | null => {
  return sessionStorage.getItem(OAUTH_STATE_KEY);
};

export const isOAuthProvider = (value: string): value is OAuthProvider => {
  return value === "google" || value === "kakao" || value === "naver";
};

export const getOAuthRedirectUri = (provider: OAuthProvider): string => {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}${APP_ROUTES.OAUTH_CALLBACK(provider)}`;
};

const OAUTH_AUTHORIZE_CONFIG: Record<OAuthProvider, OAuthAuthorizeConfig> = {
  google: {
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    scope: "openid email profile",
  },
  kakao: {
    authorizeUrl: "https://kauth.kakao.com/oauth/authorize",
    clientId: process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY ?? "",
  },
  naver: {
    authorizeUrl: "https://nid.naver.com/oauth2.0/authorize",
    clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID ?? "",
  },
};

/** 브라우저가 이동할 Provider 인가 URL */
export const buildOAuthAuthorizeUrl = (
  provider: OAuthProvider,
  params?: { state?: string },
): string => {
  const config = OAUTH_AUTHORIZE_CONFIG[provider];
  const url = new URL(config.authorizeUrl);

  const clientId = config.clientId;

  if (!clientId) {
    throw new ApiError("소셜 로그인 설정이 올바르지 않습니다.");
  }

  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", getOAuthRedirectUri(provider));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", params?.state ?? "");

  if (config.scope) {
    url.searchParams.set("scope", config.scope);
  }

  return url.toString();
};
