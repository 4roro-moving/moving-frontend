"use client";

import { create } from "zustand";

import { logout as logoutApi, refreshSession } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";
import {
  getCustomerProfileMe,
  getMoverProfileMe,
  toAuthUserFromCustomerProfile,
  toAuthUserFromMoverProfile,
} from "@/lib/api/profile";
import { getAccessTokenRole } from "@/lib/auth/accessTokenPayload";
import { clearNickname, loadNickname, saveNickname } from "@/lib/auth/nickname";
import { clearRole, loadRole, saveRole } from "@/lib/auth/role";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/token";
import { ApiError } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  displayName: string | null;
  /** 로그인 상태 여부 */
  isAuthenticated: boolean;
  /** 인증 중 여부 */
  isCheckingAuth: boolean;
  /** localStorage hydrate 완료 여부 — SSR/CSR 첫 페인트 일치용 */
  hasHydrated: boolean;
  /** localStorage에서 인증 상태 초기화 */
  hydrateFromStorage: () => void;
  /** 인증 상태 확인 */
  checkAuth: () => Promise<void>;
  /** 세션 생성 */
  establishSession: (user: AuthUser) => void;
  /** 로그인/회원가입 성공 후 세션 상태만 반영 */
  logout: () => Promise<void>;
  /** 세션 초기화 */
  clearSession: () => void;
  /** 비로그인 상태 설정 */
  markUnauthenticated: () => void;
}

// 비로그인 상태
const UNAUTHENTICATED_STATE = {
  user: null,
  displayName: null,
  isAuthenticated: false,
  isCheckingAuth: false,
  hasHydrated: true,
} as const satisfies Partial<AuthState>;

let checkAuthPromise: Promise<void> | null = null;

const setAuthenticatedUser = (
  set: (partial: Partial<AuthState>) => void,
  user: AuthUser,
  isCheckingAuth = false,
) => {
  saveNickname(user.name);
  saveRole(user.role);
  set({
    user,
    displayName: user.name,
    isAuthenticated: true,
    isCheckingAuth,
    hasHydrated: true,
  });
};

const resolveAuthUser = async (): Promise<AuthUser> => {
  const accessToken = getAccessToken();
  if (!accessToken) {
    throw new ApiError("인증 정보가 없습니다.", 401);
  }

  const role = getAccessTokenRole(accessToken) ?? loadRole();

  if (role === "MOVER") {
    const profile = await getMoverProfileMe();
    return toAuthUserFromMoverProfile(profile);
  }

  const profile = await getCustomerProfileMe();
  return toAuthUserFromCustomerProfile(profile);
};

// 세션 세대 관리
let curSessionGeneration: number = 0;

/**
 * 인증 상태 관리 스토어
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  displayName: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  hasHydrated: false,

  hydrateFromStorage: () => {
    if (get().hasHydrated) return;

    const token = getAccessToken();
    const displayName = loadNickname();

    set({
      hasHydrated: true,
      isCheckingAuth: true,
      displayName,
      isAuthenticated: Boolean(token),
      user: null,
    });
  },

  clearSession: () => {
    curSessionGeneration++;
    clearAuthTokens();
    clearNickname();
    clearRole();
    set({ ...UNAUTHENTICATED_STATE });
  },

  markUnauthenticated: () => {
    set({ ...UNAUTHENTICATED_STATE });
  },

  establishSession: (user) => {
    curSessionGeneration++;
    setAuthenticatedUser(set, user, false);
  },

  checkAuth: async () => {
    if (checkAuthPromise) {
      await checkAuthPromise;
      return;
    }

    checkAuthPromise = (async () => {
      const startSessionGeneration = curSessionGeneration;

      set({ isCheckingAuth: true });

      try {
        // Access 없음 → 선제 refresh 후 profile 1회 시도
        if (!getAccessToken()) {
          await refreshSession({ notifyOnFailure: false });
        }

        const me = await resolveAuthUser();

        // 새 세션 생성 중 다른 세션 생성 요청 시 취소
        if (startSessionGeneration !== curSessionGeneration) {
          return;
        }

        setAuthenticatedUser(set, me, false);
      } catch (error) {
        // 새 세션 생성 중 다른 세션 생성 요청 시 취소
        if (startSessionGeneration !== curSessionGeneration) {
          return;
        }

        if (process.env.NODE_ENV === "development") {
          const status = error instanceof ApiError ? error.status : undefined;
          if (status !== 401) {
            console.error("[checkAuth] 세션 복구 실패", error);
          }
        }

        const token = getAccessToken();
        const displayName = loadNickname();
        const status = error instanceof ApiError ? error.status : undefined;

        // 인증 만료·역할 불일치 → 토큰·닉네임·role 정리 후 비로그인
        if (status === 401 || status === 403) {
          get().clearSession();
          set({ isCheckingAuth: false });
          return;
        }

        // 네트워크·5xx 등 → 기존 access가 있으면 화면만 낙관 유지
        if (token) {
          set({
            displayName,
            isAuthenticated: true,
            isCheckingAuth: false,
            hasHydrated: true,
          });
          return;
        }

        get().markUnauthenticated();
      } finally {
        checkAuthPromise = null;
      }
    })();

    await checkAuthPromise;
  },

  logout: async () => {
    const logoutGeneration = curSessionGeneration;

    try {
      await logoutApi(logoutGeneration);
    } finally {
      if (logoutGeneration === curSessionGeneration) {
        get().clearSession();
      }
    }
  },
}));
