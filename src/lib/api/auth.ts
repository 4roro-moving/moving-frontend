import fetchInstance, { ensureAccessTokenRefreshed } from "@/lib/api/fetchInstance";
import { clearAuthTokens, setAuthTokens } from "@/lib/auth/token";
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
  refreshToken: string;
}

export interface LoginResult {
  user: AuthUser;
  tokens: PublicAuthTokens;
}

export const login = async (input: LoginInput): Promise<LoginResult> => {
  const data = await fetchInstance.post<LoginResult, LoginInput>(API_ROUTES.AUTH.LOGIN, input);
  setAuthTokens(data.tokens);
  return data;
};

/** body.refreshToken으로 access 재발급 (동시 호출 시 1회로 합침) */
export const refreshSession = async (): Promise<void> => {
  await ensureAccessTokenRefreshed();
};

export const logout = async (): Promise<void> => {
  try {
    await fetchInstance.post(API_ROUTES.AUTH.LOGOUT);
  } finally {
    clearAuthTokens();
  }
};
