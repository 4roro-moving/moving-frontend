"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

interface UseListboxKeyboardNavParams {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** 다열 리스트일 때 세로 이동 간격 (기본 1) */
  columns?: number;
}

/**
 * combobox + role="listbox" 방향키 제어 시 옵션 focus 이동을 공통으로 처리하는 훅.
 *
 * - 리스트 옵션은  *** role="option" *** 이 붙은 <button>이어야 합니다.
 * - 열릴 때 aria-selected="true"인 옵션이 있으면 그 옵션에 focus되고, 없으면 첫 옵션에 focus됩니다.
 */
export const useListboxKeyboardNav = <
  TTrigger extends HTMLElement = HTMLButtonElement,
  TListbox extends HTMLElement = HTMLElement,
>({
  isOpen,
  onOpen,
  onClose,
  columns = 1,
}: UseListboxKeyboardNavParams) => {
  const triggerRef = useRef<TTrigger>(null);
  const listboxRef = useRef<TListbox>(null);

  useEffect(() => {
    if (!isOpen) return;

    const target =
      listboxRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]') ??
      listboxRef.current?.querySelector<HTMLElement>('[role="option"]');
    target?.focus();
  }, [isOpen]);

  /*
   * - Escape 키를 누르면 모달을 닫습니다.
   * - 방향키가 눌리면 리스트 옵션에 focus되도록 합니다.
   */
  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      onOpen();
    }
  };

  /* 리스트 옵션에 방향키가 눌리면 옵션에 focus되도록 합니다. */
  const handleListboxKeyDown = (event: KeyboardEvent) => {
    const options = Array.from(
      listboxRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
    );
    if (options.length === 0) return;

    const currentIndex = Math.max(0, options.indexOf(document.activeElement as HTMLElement));
    const columnIndex = currentIndex % columns;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (columns === 1) {
        options[(currentIndex + 1) % options.length]?.focus();
      } else {
        const nextIndex = currentIndex + columns;
        if (nextIndex < options.length) {
          options[nextIndex]?.focus();
        }
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (columns === 1) {
        options[(currentIndex - 1 + options.length) % options.length]?.focus();
      } else {
        const nextIndex = currentIndex - columns;
        if (nextIndex >= 0) {
          options[nextIndex]?.focus();
        }
      }
    } else if (event.key === "ArrowRight" && columns > 1) {
      event.preventDefault();
      if (columnIndex < columns - 1 && currentIndex + 1 < options.length) {
        options[currentIndex + 1]?.focus();
      }
    } else if (event.key === "ArrowLeft" && columns > 1) {
      event.preventDefault();
      if (columnIndex > 0) {
        options[currentIndex - 1]?.focus();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      triggerRef.current?.focus();
    } else if (event.key === "Tab") {
      onClose();
    }
  };

  const focusTrigger = () => triggerRef.current?.focus();

  return { triggerRef, listboxRef, handleTriggerKeyDown, handleListboxKeyDown, focusTrigger };
};
