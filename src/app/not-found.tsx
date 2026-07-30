import type { Metadata } from "next";

import NotFoundView from "@/components/common/NotFoundView";

export const metadata: Metadata = {
  title: "404 | MOVING",
};

/**
 * App Router 전역 Not Found
 * // 2026.07.30 정슬기 - [추가]
 */
export default function NotFound() {
  return <NotFoundView />;
}
