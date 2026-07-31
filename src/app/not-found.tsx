import type { Metadata } from "next";

import NotFoundView from "@/components/common/NotFoundView";

export const metadata: Metadata = {
  title: "404 | MOVING",
};

/**
 * App Router 전역 Not Found
 * // 2026.07.30 정슬기 - [추가]
 * // 2026.07.31 정슬기 - [수정] data-not-found-page 마커로 auth:expired 등 자동 이동 제외
 */
export default function NotFound() {
  return (
    <div data-not-found-page="">
      <NotFoundView />
    </div>
  );
}
