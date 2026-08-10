import type { AuthUser } from "@/lib/api/auth";
import {
  clearClientStorageHint,
  getClientStorageHint,
  setClientStorageHint,
} from "@/lib/auth/clientStorageHint";

/**
 * Header SSR/첫 페인트용 role 힌트 (cookie + localStorage)
 */

export const ROLE_STORAGE_KEY = "moving_role" as const;

export type AuthRole = AuthUser["role"];

export const parseAuthRole = (value: string | null | undefined): AuthRole | null => {
  if (value === "CUSTOMER" || value === "MOVER" || value === "ADMIN") {
    return value;
  }
  return null;
};

export const saveRole = (role: AuthRole): void => {
  setClientStorageHint(ROLE_STORAGE_KEY, role);
};

export const loadRole = (): AuthRole | null => {
  return parseAuthRole(getClientStorageHint(ROLE_STORAGE_KEY));
};

export const clearRole = (): void => {
  clearClientStorageHint(ROLE_STORAGE_KEY);
};
