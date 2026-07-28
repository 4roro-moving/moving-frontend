import axiosInstance from "@/lib/api/axiosInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";

/**
 * // 2026.07.24 정슬기 - [추가] 개발 전용 로그인 API 호출 (실제 로그인 PR 병합 시 삭제)
 */

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface DevLoginRequest {
  email: string;
  password: string;
}

export interface DevLoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    role: string;
  };
  tokens: {
    accessToken: string;
    /** HttpOnly Cookie 전환 후에는 생략될 수 있음 */
    refreshToken?: string;
  };
}

export async function loginWithPassword(input: DevLoginRequest): Promise<DevLoginResponse> {
  const { data } = await axiosInstance.post<ApiSuccessResponse<DevLoginResponse>>(
    API_ROUTES.AUTH.LOGIN,
    {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  );

  return data.data;
}
