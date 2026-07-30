import type { AuthRole } from "@/lib/auth/role";
import { parseAuthRole } from "@/lib/auth/role";

/**
 * Access JWT payload에서 role을 읽습니다.
 */
export const getAccessTokenRole = (token: string): AuthRole | null => {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const json = atob(padded);
    const payload = JSON.parse(json) as { role?: string };

    return parseAuthRole(payload.role);
  } catch {
    return null;
  }
};
