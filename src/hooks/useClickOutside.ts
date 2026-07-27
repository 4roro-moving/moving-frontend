"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * 지정된 ref 영역 바깥을 클릭했을 때 콜백을 실행하는 훅
 * Select, Dropdown, Popover 등 "열림/닫힘" 상태를 갖는 공통 컴포넌트에서 재사용합니다.
 */
export function useClickOutside<T extends HTMLElement>(
  onOutsideClick: () => void,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const handlerRef = useRef(onOutsideClick);

  useEffect(() => {
    handlerRef.current = onOutsideClick;
  }, [onOutsideClick]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && event.target instanceof Node && !ref.current.contains(event.target)) {
        handlerRef.current();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return ref;
}
