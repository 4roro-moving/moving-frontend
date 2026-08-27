import { getApiError } from "@/lib/api/getApiError";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { AuthAudience } from "@/lib/auth/redirect";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export type LoginErrorCopy = {
  roleMismatchCustomer: string;
  roleMismatchMover: string;
  accountSuspended: string;
  suspensionReasonPrefix: string;
  fallback: string;
};

export const isAccountSuspended = (error: unknown): boolean =>
  getApiError(error).code === ERROR_CODES.ACCOUNT_SUSPENDED.code;

export const getAccountSuspensionReason = (error: unknown): string | undefined => {
  const { code, data } = getApiError(error);

  return code === ERROR_CODES.ACCOUNT_SUSPENDED.code &&
    typeof data === "object" &&
    data !== null &&
    "reason" in data &&
    typeof data.reason === "string"
    ? data.reason
    : undefined;
};

export const isSuspensionAppealAvailable = (error: unknown): boolean => {
  const { code, data } = getApiError(error);

  return (
    code === ERROR_CODES.ACCOUNT_SUSPENDED.code &&
    typeof data === "object" &&
    data !== null &&
    "appealAvailable" in data &&
    data.appealAvailable === true
  );
};

export const getLoginErrorMessage = (
  error: unknown,
  pageAudience: AuthAudience,
  copy: LoginErrorCopy,
): string => {
  const apiError = getApiError(error);

  if (apiError.code === ERROR_CODES.AUTH_ROLE_MISMATCH.code) {
    return pageAudience === "mover" ? copy.roleMismatchMover : copy.roleMismatchCustomer;
  }

  if (apiError.code === ERROR_CODES.ACCOUNT_SUSPENDED.code) {
    const reason = getAccountSuspensionReason(error);

    return reason
      ? `${copy.accountSuspended}\n${copy.suspensionReasonPrefix}: ${reason}`
      : copy.accountSuspended;
  }

  return getApiErrorMessage(error, copy.fallback);
};
