import fetchInstance from "@/lib/api/fetchInstance";
import { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";
import type { EnsureAccessTokenOptions } from "@/lib/auth/refreshAccessToken";
import { clearAuthTokens, setAccessToken } from "@/lib/auth/token";
import { AUTH_BFF_BASE } from "@/lib/constants/authBff";
import { API_ROUTES } from "@/lib/constants/apiRoutes";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "CUSTOMER" | "MOVER" | "ADMIN";
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

export const login = async (input: LoginInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, LoginInput>(
    API_ROUTES.AUTH.LOGIN,
    input,
    authBffOptions,
  );
  setAccessToken(data.tokens.accessToken);
  return data;
};

/** HttpOnly refresh cookie로 access 재발급 (Next auth BFF) */
export const refreshSession = async (options?: EnsureAccessTokenOptions): Promise<void> => {
  await ensureAccessTokenRefreshed(options);
};

export const logout = async (): Promise<void> => {
  try {
    await fetchInstance.post(API_ROUTES.AUTH.LOGOUT, undefined, authBffOptions);
  } finally {
    clearAuthTokens();
  }
};
