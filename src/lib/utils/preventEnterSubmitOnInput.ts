import type { KeyboardEvent } from "react";

/**
 * 한 줄 input에서 Enter로 form이 submit되는 기본 동작을 막습니다.
 * textarea·button 등 input이 아닌 요소에서는 동작하지 않습니다.
 */
export const preventEnterSubmitOnInput = (event: KeyboardEvent<HTMLFormElement>) => {
  if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
  if (!(event.target instanceof HTMLInputElement)) return;

  event.preventDefault();
};
