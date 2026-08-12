import type { AuthUser } from "@/lib/api/auth";
import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header SSR/첫 페인트용 role 힌트 (role Soft UX 쿠키)
 */

export const ROLE_STORAGE_KEY = "moving_role" as const;

export type AuthRole = AuthUser["role"];

/** JWT·API payload용. ADMIN 포함 */
export const parseAuthRole = (value: string | null | undefined): AuthRole | null => {
  if (value === "CUSTOMER" || value === "MOVER" || value === "ADMIN") {
    return value;
  }
  return null;
};

/** Soft UX(Header/가드 힌트)용. ADMIN·임의 문자열은 무시 */
export const parseSoftUxAuthRole = (value: string | null | undefined): AuthRole | null => {
  if (value === "CUSTOMER" || value === "MOVER") {
    return value;
  }
  return null;
};

export const saveRole = (role: AuthRole): void => {
  const softUxRole = parseSoftUxAuthRole(role);
  if (!softUxRole) return;

  setClientStorageHint(ROLE_STORAGE_KEY, softUxRole);
};

export const loadRole = (): AuthRole | null => {
  return parseSoftUxAuthRole(getClientStorageHint(ROLE_STORAGE_KEY));
};

export const clearRole = (): void => {
  clearClientStorageHint(ROLE_STORAGE_KEY);
};
