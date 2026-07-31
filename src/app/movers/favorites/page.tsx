import type { Metadata } from "next";

import FavoriteMoversPageClient from "@/components/mover/FavoriteMoversPageClient";

export const metadata: Metadata = {
  title: "찜한 기사님",
  description: "찜한 이사 기사님 목록을 확인하세요.",
};

export default function FavoriteMoversPage() {
  return <FavoriteMoversPageClient />;
}
