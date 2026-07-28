import fetchInstance, { ensureAccessTokenRefreshed } from "@/lib/api/fetchInstance";
import { clearAuthTokens, setAccessToken } from "@/lib/auth/token";
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
}

export interface LoginResult {
  user: AuthUser;
  tokens: PublicAuthTokens;
}

export const login = async (input: LoginInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, LoginInput>(API_ROUTES.AUTH.LOGIN, input);
  setAccessToken(data.tokens.accessToken);
  return data;
};

/** HttpOnly refresh cookie로 access 재발급 */
export const refreshSession = async (options?: { notifyOnFailure?: boolean }): Promise<void> => {
  await ensureAccessTokenRefreshed(options);
};

export const logout = async (): Promise<void> => {
  try {
    // refresh는 cookie로 전달됨 (credentials: include)
    await fetchInstance.post(API_ROUTES.AUTH.LOGOUT);
  } finally {
    clearAuthTokens();
  }
};
