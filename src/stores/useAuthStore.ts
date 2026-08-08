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
import { getAccessTokenPayload, getAccessTokenRole } from "@/lib/auth/accessTokenPayload";
import { isAuthPagePath, isOAuthCallbackPath } from "@/lib/auth/redirect";
import { clearNickname, loadNickname, saveNickname } from "@/lib/auth/nickname";
import { clearProfileImage, saveProfileImage } from "@/lib/auth/profileImage";
import { clearRole, loadRole, saveRole } from "@/lib/auth/role";
import { clearAuthTokens, getAccessToken } from "@/lib/auth/token";
import { clearAppQueryCache } from "@/providers/query/appQueryClient";
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
  /**
   * 로그인/가입 직후 GuestOnly가 사용할 목적지.
   * consume 시 한 번만 읽고 null로 비웁니다.
   */
  postAuthRedirectPath: string | null;
  /** localStorage에서 인증 상태 초기화 */
  hydrateFromStorage: () => void;
  /** 인증 상태 확인 */
  checkAuth: () => Promise<void>;
  /** 세션 생성 */
  establishSession: (user: AuthUser) => void;
  /** 로그인/회원가입 성공 후 이동 경로 예약 (establishSession 전에 호출) */
  setPostAuthRedirectPath: (path: string) => void;
  /** 예약된 이동 경로를 읽고 비웁니다 */
  consumePostAuthRedirectPath: () => string | null;
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
  postAuthRedirectPath: null,
} as const satisfies Partial<AuthState>;

let checkAuthPromise: Promise<void> | null = null;

const setAuthenticatedUser = (
  set: (partial: Partial<AuthState>) => void,
  user: AuthUser,
  isCheckingAuth = false,
) => {
  saveNickname(user.name);
  saveRole(user.role);
  saveProfileImage(user.imageUrl ?? "");
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

/**
 * auth 페이지 재진입·/me 실패 시 — profile/me 없이 JWT·쿠키만으로 세션 힌트.
 *
 * 용도: Header·AuthGate·ProfileCompletionGuard 등 클라이언트 Soft UX.
 * 비목적: 권한·인가의 근거. 보호 API는 fetchInstance 사용 시 Access Token의 백엔드 검증에 의존한다.
 * /me 네트워크·5xx에서도 동일 경로를 쓰므로, user.id/role을
 * “서버가 보장한 프로필 상태”로 취급하지 않는다.
 */
const resolveAuthUserFromTokenHint = (): AuthUser | null => {
  const accessToken = getAccessToken();
  if (!accessToken) return null;

  const payload = getAccessTokenPayload(accessToken);
  const role = payload.role ?? loadRole();
  if (!role) return null;

  const name = loadNickname() ?? "";

  return {
    id: payload.userId ?? "",
    email: "",
    name,
    phone: null,
    role,
  };
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
  postAuthRedirectPath: null,

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
    clearProfileImage();
    get().markUnauthenticated();
  },

  markUnauthenticated: () => {
    set({ ...UNAUTHENTICATED_STATE });
    clearAppQueryCache();
  },

  setPostAuthRedirectPath: (path) => {
    set({ postAuthRedirectPath: path });
  },

  consumePostAuthRedirectPath: () => {
    const path = get().postAuthRedirectPath;
    if (path) {
      set({ postAuthRedirectPath: null });
    }
    return path;
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
        // OAuth callback: code 교환과 겹치지 않도록 refresh/profile 생략
        // establishSession과 경합하지 않도록 markUnauthenticated는 호출하지 않음
        const onOAuthCallback =
          typeof window !== "undefined" && isOAuthCallbackPath(window.location.pathname);

        if (onOAuthCallback) {
          if (startSessionGeneration !== curSessionGeneration) {
            return;
          }
          set({ isCheckingAuth: false, hasHydrated: true });
          return;
        }

        // Access 없음 → 선제 refresh 후 profile 1회 시도
        if (!getAccessToken()) {
          await refreshSession({ notifyOnFailure: false });
        }

        // login/signup 재진입: profile/me 생략 (GuestOnly가 역할 홈으로 보냄)
        const onAuthPage =
          typeof window !== "undefined" && isAuthPagePath(window.location.pathname);

        if (onAuthPage) {
          const hintedUser = resolveAuthUserFromTokenHint();
          if (startSessionGeneration !== curSessionGeneration) {
            return;
          }

          if (hintedUser) {
            setAuthenticatedUser(set, hintedUser, false);
            return;
          }

          get().markUnauthenticated();
          return;
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
        const status = error instanceof ApiError ? error.status : undefined;

        // 인증 만료·역할 불일치 → 토큰·닉네임·role 정리 후 비로그인
        if (status === 401 || status === 403) {
          get().clearSession();
          set({ isCheckingAuth: false });
          return;
        }

        // 프로필 미생성(me 404)·일시 오류(5xx 등): JWT 힌트로 user를 채움.
        // UI 가드용 임시 상태일 뿐이며, 보호 API 권한은 백엔드 토큰 검증에 맡긴다.
        if (token) {
          const hintedUser = resolveAuthUserFromTokenHint();
          if (hintedUser) {
            setAuthenticatedUser(set, hintedUser, false);
            return;
          }

          set({
            displayName: loadNickname(),
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
      await logoutApi();
    } finally {
      if (logoutGeneration === curSessionGeneration) {
        get().clearSession();
      }
    }
  },
}));
