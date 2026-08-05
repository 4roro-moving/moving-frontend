/** BE VALIDATION_ERROR의 `error.data`에서 화면용 메시지를 추출합니다. */
export const getValidationDataMessage = (details: unknown): string | undefined => {
  if (typeof details === "object" && details !== null && !Array.isArray(details)) {
    const message = (details as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  if (Array.isArray(details)) {
    const messages = details
      .map((item) => {
        if (typeof item === "object" && item !== null) {
          const message = (item as { message?: unknown }).message;
          return typeof message === "string" ? message.trim() : "";
        }
        return "";
      })
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.join("\n");
    }
  }

  return undefined;
};
