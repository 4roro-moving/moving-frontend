import axiosInstance from "@/lib/api/axiosInstance";
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

export interface LoginResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    tokens: PublicAuthTokens;
  };
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

export interface RefreshResponse {
  success: boolean;
  data?: {
    tokens: PublicAuthTokens;
  };
  error?: {
    code?: string;
    message?: string;
  };
  message?: string;
}

function assertAccessToken(
  data: {
    success: boolean;
    data?: { tokens?: PublicAuthTokens };
    error?: { message?: string };
    message?: string;
  },
  fallbackMessage: string,
): string {
  const accessToken = data.data?.tokens?.accessToken;

  if (!data.success || !accessToken) {
    throw new Error(data.error?.message || data.message || fallbackMessage);
  }

  return accessToken;
}

export async function login(input: LoginInput): Promise<NonNullable<LoginResponse["data"]>> {
  const { data } = await axiosInstance.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, input);
  const accessToken = assertAccessToken(data, "로그인에 실패했습니다.");

  setAccessToken(accessToken);
  return data.data!;
}

/** HttpOnly refresh cookie로 access token 재발급 */
export async function refreshSession(): Promise<string> {
  const { data } = await axiosInstance.post<RefreshResponse>(API_ROUTES.AUTH.REFRESH);
  const accessToken = assertAccessToken(data, "세션 갱신에 실패했습니다.");

  setAccessToken(accessToken);
  return accessToken;
}

export async function logout(): Promise<void> {
  try {
    await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  } finally {
    clearAuthTokens();
  }
}
