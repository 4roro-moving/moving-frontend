"use client";

import { create } from "zustand";

import { login as loginApi, logout as logoutApi, refreshSession } from "@/lib/api/auth";
import type { AuthUser, LoginInput } from "@/lib/api/auth";
import { getCustomerProfileMe, toAuthUserFromCustomerProfile } from "@/lib/api/profile";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/token";
import { clearAuthUserCache, loadAuthUserCache, saveAuthUserCache } from "@/lib/auth/userCache";
import { ApiError } from "@/types/api";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  /** localStorage hydrate 완료 여부 — SSR/CSR 첫 페인트 일치용 */
  hasHydrated: boolean;
  hydrateFromStorage: () => void;
  checkAuth: () => Promise<void>;
  login: (input: LoginInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
  clearSession: () => void;
}

let checkAuthPromise: Promise<void> | null = null;

const setAuthenticatedUser = (
  set: (partial: Partial<AuthState>) => void,
  user: AuthUser,
  isCheckingAuth = false,
) => {
  saveAuthUserCache(user);
  set({ user, isAuthenticated: true, isCheckingAuth, hasHydrated: true });
};

export const useAuthStore = create<AuthState>((set, get) => ({
  // SSR·클라이언트의 첫 렌더는 항상 동일해야 hydration mismatch가 없음
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true,
  hasHydrated: false,

  hydrateFromStorage: () => {
    if (get().hasHydrated) return;

    const token = getAccessToken();
    const cached = loadAuthUserCache();

    if (token && cached) {
      set({
        user: cached,
        isAuthenticated: true,
        isCheckingAuth: true,
        hasHydrated: true,
      });
      return;
    }

    set({ hasHydrated: true, isCheckingAuth: true });
  },

  clearSession: () => {
    clearAuthTokens();
    clearAuthUserCache();
    set({ user: null, isAuthenticated: false, hasHydrated: true });
  },

  checkAuth: async () => {
    if (checkAuthPromise) {
      await checkAuthPromise;
      return;
    }

    checkAuthPromise = (async () => {
      set({ isCheckingAuth: true });

      try {
        if (!getAccessToken()) {
          await refreshSession();
        }

        const profile = await getCustomerProfileMe();
        const me = toAuthUserFromCustomerProfile(profile);
        setAuthenticatedUser(set, me, false);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("[checkAuth] 세션 복구 실패", error);
        }

        const token = getAccessToken();
        const cached = loadAuthUserCache();
        const status = error instanceof ApiError ? error.status : undefined;

        if (token && cached && status !== 401) {
          setAuthenticatedUser(set, cached, false);
          return;
        }

        get().clearSession();
        set({ isCheckingAuth: false });
      } finally {
        checkAuthPromise = null;
      }
    })();

    await checkAuthPromise;
  },

  login: async (input) => {
    const { user } = await loginApi(input);
    setAuthenticatedUser(set, user, false);
    return user;
  },

  logout: async () => {
    try {
      await logoutApi();
    } finally {
      get().clearSession();
    }
  },
}));
