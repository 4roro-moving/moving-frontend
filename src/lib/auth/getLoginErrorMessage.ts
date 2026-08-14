import { getApiError } from "@/lib/api/getApiError";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { getAudienceMismatchMessage, type AuthAudience } from "@/lib/auth/redirect";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export const getLoginErrorMessage = (error: unknown, pageAudience: AuthAudience): string => {
  if (getApiError(error).code === ERROR_CODES.AUTH_ROLE_MISMATCH.code) {
    return getAudienceMismatchMessage(pageAudience);
  }

  return getApiErrorMessage(error);
};
