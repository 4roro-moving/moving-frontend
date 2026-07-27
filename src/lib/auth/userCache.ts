import type { AuthUser } from "@/lib/api/auth";

const AUTH_USER_CACHE_KEY = "moving_auth_user";

export const saveAuthUserCache = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTH_USER_CACHE_KEY, JSON.stringify(user));
};

export const loadAuthUserCache = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(AUTH_USER_CACHE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearAuthUserCache = (): void => {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(AUTH_USER_CACHE_KEY);
};
