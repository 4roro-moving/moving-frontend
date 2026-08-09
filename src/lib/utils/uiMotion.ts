import { cn } from "@/lib/utils/cn";

/** exit keyframe 길이와 맞춤 — usePresence 언마운트 지연 */
export const DROPDOWN_EXIT_DURATION_MS = 160;
export const TOAST_EXIT_DURATION_MS = 180;
export const SHEET_EXIT_DURATION_MS = 180;

/**
 * 드롭다운 등장/퇴장 모션 클래스
 * // 2026.08.07 정슬기 - [추가]
 */
export function dropdownMotionClassName(
  isVisible: boolean,
  origin: "top" | "bottom" = "top",
): string {
  return cn(
    origin === "top" ? "origin-top" : "origin-bottom",
    "motion-reduce:animate-none",
    isVisible ? "animate-dropdown-in" : "animate-dropdown-out",
    !isVisible && "pointer-events-none",
  );
}

/**
 * 토스트 등장/퇴장 모션 클래스
 * // 2026.08.07 정슬기 - [추가]
 */
export function toastMotionClassName(isVisible: boolean): string {
  return cn("motion-reduce:animate-none", isVisible ? "animate-toast-in" : "animate-toast-out");
}
