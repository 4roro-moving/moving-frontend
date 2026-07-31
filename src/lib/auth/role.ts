import type { AuthUser } from "@/lib/api/auth";

/**
 * Header SSR/첫 페인트용 role 힌트 (cookie + localStorage)
 */

export const ROLE_STORAGE_KEY = "moving_role";

export type AuthRole = AuthUser["role"];

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const parseAuthRole = (value: string | null | undefined): AuthRole | null => {
  if (value === "CUSTOMER" || value === "MOVER" || value === "ADMIN") {
    return value;
  }
  return null;
};

export const saveRole = (role: AuthRole): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(ROLE_STORAGE_KEY, role);
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ROLE_STORAGE_KEY}=${encodeURIComponent(role)}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_SECONDS}${secureFlag}`;
};

export const loadRole = (): AuthRole | null => {
  if (typeof window === "undefined") return null;
  return parseAuthRole(localStorage.getItem(ROLE_STORAGE_KEY));
};

export const clearRole = (): void => {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ROLE_STORAGE_KEY);
  document.cookie = `${ROLE_STORAGE_KEY}=; Path=/; Max-Age=0; SameSite=Lax`;
};
