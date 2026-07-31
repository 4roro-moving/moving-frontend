import type { AuthRole } from "@/lib/auth/role";
import { parseAuthRole } from "@/lib/auth/role";

interface AccessTokenPayload {
  userId: string | null;
  role: AuthRole | null;
}

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment) return null;

    const normalized = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
};

/**
 * Access JWT payload에서 userId·role을 읽습니다. (서명 검증 없음 — API가 최종 검증)
 */
export const getAccessTokenPayload = (token: string): AccessTokenPayload => {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return { userId: null, role: null };
  }

  const userId = typeof payload.userId === "string" ? payload.userId : null;
  const role = parseAuthRole(typeof payload.role === "string" ? payload.role : null);

  return { userId, role };
};

export const getAccessTokenRole = (token: string): AuthRole | null => {
  return getAccessTokenPayload(token).role;
};
