import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS className 병합 유틸리티
 *
 * - 조건부 클래스 적용 (clsx)
 * - Tailwind 클래스 충돌 해결 (tailwind-merge)
 *
 * Example:
 * cn(
 *   "px-4 py-2",
 *   isActive && "bg-blue-500",
 *   "p-2",
 *   "p-4"
 * )
 * => "py-2 px-4 bg-blue-500 p-4"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
