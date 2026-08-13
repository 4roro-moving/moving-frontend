import type { KeyboardEvent } from "react";

const TEXT_INPUT_TYPES = new Set(["text", "password", "email", "tel", "search", "url"]);

/**
 * 한 줄 input에서 Enter로 form이 submit되는 기본 동작을 막습니다.
 * textarea·button 등 input이 아닌 요소에서는 동작하지 않습니다.
 */
export const shouldPreventEnterSubmitOnInput = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) return false;
  if (!(event.target instanceof HTMLInputElement)) return false;

  return TEXT_INPUT_TYPES.has(event.target.type);
};

export const preventEnterSubmitOnInput = (event: KeyboardEvent<HTMLFormElement>) => {
  if (shouldPreventEnterSubmitOnInput(event)) {
    event.preventDefault();
  }
};
