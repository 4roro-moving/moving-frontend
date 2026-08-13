"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

/**
 * body 스크롤을 잠급니다.
 * 이미 잠금 중이면 스타일은 다시 건드리지 않고 lockCount만 올립니다.
 * (Modal + SideNav처럼 중첩 오픈 시 한쪽이 닫혀도 스크롤이 풀리지 않도록)
 */
const lockBodyScroll = () => {
  if (lockCount === 0) {
    // 잠금 해제 시 원래 인라인 스타일로 되돌리기 위해 보관
    previousOverflow = document.body.style.overflow;
    previousPaddingRight = document.body.style.paddingRight;

    // overflow: hidden 시 스크롤바가 사라져 레이아웃이 흔들리지 않도록 보정
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const existingPaddingRight =
      Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${existingPaddingRight + scrollbarWidth}px`;
    }
  }

  lockCount += 1;
};

/**
 * 잠금 참조를 하나 줄입니다.
 * lockCount가 0이 될 때만 실제 스크롤 잠금을 해제합니다.
 */
const unlockBodyScroll = () => {
  // 언락이 락보다 많이 호출되어도 음수가 되지 않도록 방어
  lockCount = Math.max(0, lockCount - 1);

  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow;
    document.body.style.paddingRight = previousPaddingRight;
  }
};

/**
 * overlay(Modal, SideNav 등)가 열려 있는 동안 body 스크롤을 잠급니다.
 * 중첩 잠금은 참조 카운트로 관리해, 한쪽이 닫혀도 다른 잠금이 남아 있으면 유지합니다.
 */
export const useBodyScrollLock = (locked: boolean): void => {
  useEffect(() => {
    if (!locked) {
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [locked]);
};
