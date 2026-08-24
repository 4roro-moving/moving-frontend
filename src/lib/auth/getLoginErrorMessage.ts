import { getApiError } from "@/lib/api/getApiError";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getAudienceMismatchMessage, type AuthAudience } from "@/lib/auth/redirect";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

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

export const getLoginErrorMessage = (error: unknown, pageAudience: AuthAudience): string => {
  const apiError = getApiError(error);

  if (apiError.code === ERROR_CODES.AUTH_ROLE_MISMATCH.code) {
    return getAudienceMismatchMessage(pageAudience);
  }

  if (apiError.code === ERROR_CODES.ACCOUNT_SUSPENDED.code) {
    const reason = getAccountSuspensionReason(error);

    return reason
      ? `${ERROR_CODES.ACCOUNT_SUSPENDED.message}\n정지 사유: ${reason}`
      : ERROR_CODES.ACCOUNT_SUSPENDED.message;
  }

  return getApiErrorMessage(error);
};
