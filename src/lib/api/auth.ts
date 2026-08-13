import fetchInstance from "@/lib/api/fetchInstance";
import { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";
import type { EnsureAccessTokenOptions } from "@/lib/auth/refreshAccessToken";
import type { AuthRole, LoginRole } from "@/lib/auth/role";
import { setAccessToken } from "@/lib/auth/token";
import { AUTH_BFF_BASE } from "@/lib/constants/authBff";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError } from "@/types/api";
import { OAuthProvider } from "../auth/oauth";

export interface LoginInput {
  email: string;
  password: string;
  role: LoginRole;
}

export interface SignUpCustomerInput {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export type SignUpMoverInput = SignUpCustomerInput;

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: AuthRole;
  imageUrl?: string | null;
}

export interface PublicAuthTokens {
  accessToken: string;
  /** HttpOnly Cookie 전환 후에는 응답에 포함되지 않음 */
  refreshToken?: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: PublicAuthTokens;
}

const authBffOptions = {
  baseURL: AUTH_BFF_BASE,
  skipAuth: true,
} as const;

const applyAccessTokenFromAuthResult = (
  data: { tokens?: { accessToken?: string } },
  fallbackMessage: string,
): void => {
  const accessToken = data.tokens?.accessToken;
  if (!accessToken) {
    throw new ApiError(fallbackMessage);
  }
  setAccessToken(accessToken);
};

export const login = async (input: LoginInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, LoginInput>(
    API_ROUTES.AUTH.LOGIN,
    input,
    authBffOptions,
  );
  applyAccessTokenFromAuthResult(data, "로그인에 실패했습니다.");
  return data;
};

export const signUpCustomer = async (input: SignUpCustomerInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, SignUpCustomerInput>(
    API_ROUTES.AUTH.SIGN_UP_CUSTOMER,
    input,
    authBffOptions,
  );
  applyAccessTokenFromAuthResult(data, "회원가입에 실패했습니다.");
  return data;
};

export const signUpMover = async (input: SignUpMoverInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, SignUpMoverInput>(
    API_ROUTES.AUTH.SIGN_UP_MOVER,
    input,
    authBffOptions,
  );
  applyAccessTokenFromAuthResult(data, "회원가입에 실패했습니다.");
  return data;
};

/** HttpOnly refresh cookie로 access 재발급 (Next auth BFF) */
export const refreshSession = async (options?: EnsureAccessTokenOptions): Promise<void> => {
  await ensureAccessTokenRefreshed(options);
};

export const logout = async (): Promise<void> => {
  await fetchInstance.post(API_ROUTES.AUTH.LOGOUT, undefined, authBffOptions);
};

export interface OAuthLoginInput {
  code: string;
  role: LoginRole;
  state?: string;
}

export interface NaverOAuthStateResult {
  state: string;
}

export const getNaverOAuthState = async (): Promise<NaverOAuthStateResult> => {
  return fetchInstance.get<NaverOAuthStateResult>(
    API_ROUTES.AUTH.NAVER_OAUTH_STATE,
    authBffOptions,
  );
};

export const loginWithOAuth = async (
  provider: OAuthProvider,
  input: OAuthLoginInput,
): Promise<LoginResult> => {
  const path =
    provider === "google"
      ? API_ROUTES.AUTH.GOOGLE_LOGIN
      : provider === "kakao"
        ? API_ROUTES.AUTH.KAKAO_LOGIN
        : API_ROUTES.AUTH.NAVER_LOGIN;

  const data = await fetchInstance.post<LoginResult, OAuthLoginInput>(path, input, authBffOptions);
  applyAccessTokenFromAuthResult(data, "소셜 로그인에 실패했습니다.");
  return data;
};
