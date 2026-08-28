import axios from "axios";

import { getValidationDataMessage } from "@/lib/api/getValidationDataMessage";
import { ApiError } from "@/types/api";

export const getApiErrorMessage = (error: unknown, fallback = "요청에 실패했습니다."): string => {
  if (error instanceof ApiError) {
    if (error.code === "VALIDATION_ERROR") {
      const fromDetails = getValidationDataMessage(error.data?.details);
      if (fromDetails) {
        return fromDetails;
      }
    }

    if (error.message.trim()) {
      return error.message;
    }
  }

  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    const code = body?.error?.code;
    if (code === "VALIDATION_ERROR") {
      const fromDetails = getValidationDataMessage(body?.error?.data);
      if (fromDetails) {
        return fromDetails;
      }
    }

    const message = body?.error?.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
