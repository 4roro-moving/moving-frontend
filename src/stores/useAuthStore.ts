"use client";

import { create } from "zustand";

import { logout as logoutApi, refreshSession } from "@/lib/api/auth";
import type { AuthUser } from "@/lib/api/auth";
import { getCustomerProfileMe, toAuthUserFromCustomerProfile } from "@/lib/api/profile";
import { clearNickname, loadNickname, saveNickname } from "@/lib/auth/nickname";
import { runWithSessionCheck } from "@/lib/auth/refreshAccessToken";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/token";
import { ApiError } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  /** Header 등 표시용. nickname storage / login·checkAuth 로 채움 */
  displayName: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  /** localStorage hydrate 완료 여부 — SSR/CSR 첫 페인트 일치용 */
  hasHydrated: boolean;
  hydrateFromStorage: () => void;
  checkAuth: () => Promise<void>;
  /** 로그인/회원가입 성공 후 세션 상태만 반영 */
  establishSession: (user: AuthUser) => void;
  logout: () => Promise<void>;
  /** access + nickname 삭제 — logout에서만 사용 */
  clearSession: () => void;
  /** 저장소는 유지하고 메모리 상태만 비로그인 */
  markUnauthenticated: () => void;
}

let checkAuthPromise: Promise<void> | null = null;

const setAuthenticatedUser = (
  set: (partial: Partial<AuthState>) => void,
  user: AuthUser,
  isCheckingAuth = false,
) => {
  saveNickname(user.name);
  set({
    user,
    displayName: user.name,
    isAuthenticated: true,
    isCheckingAuth,
    hasHydrated: true,
  });
};

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
    clearAuthTokens();
    clearNickname();
    set({
      user: null,
      displayName: null,
      isAuthenticated: false,
      hasHydrated: true,
    });
  },

  markUnauthenticated: () => {
    set({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
      hasHydrated: true,
    });
  },

  establishSession: (user) => {
    setAuthenticatedUser(set, user, false);
  },

  checkAuth: async () => {
    if (checkAuthPromise) {
      await checkAuthPromise;
      return;
    }

    checkAuthPromise = (async () => {
      set({ isCheckingAuth: true });

      try {
        await runWithSessionCheck(async () => {
          if (!getAccessToken()) {
            await refreshSession({ notifyOnFailure: false });
          }

          const profile = await getCustomerProfileMe();
          const me = toAuthUserFromCustomerProfile(profile);
          setAuthenticatedUser(set, me, false);
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          const status = error instanceof ApiError ? error.status : undefined;
          if (status !== 401) {
            console.error("[checkAuth] 세션 복구 실패", error);
          }
        }

        const token = getAccessToken();
        const displayName = loadNickname();
        const status = error instanceof ApiError ? error.status : undefined;

        if (token && status !== 401) {
          set({
            displayName,
            isAuthenticated: true,
            isCheckingAuth: false,
            hasHydrated: true,
          });
          return;
        }

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
    try {
      await logoutApi();
    } finally {
      get().clearSession();
    }
  },
}));
