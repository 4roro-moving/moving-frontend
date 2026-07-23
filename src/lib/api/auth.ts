import axiosInstance from "@/lib/api/axiosInstance";
import { setAuthTokens } from "@/lib/auth/token";
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: AuthUser;
    tokens: AuthTokens;
  };
}

export async function login(input: LoginInput): Promise<LoginResponse["data"]> {
  const { data } = await axiosInstance.post<LoginResponse>(API_ROUTES.AUTH.LOGIN, input);
  setAuthTokens(data.data.tokens);
  return data.data;
}
