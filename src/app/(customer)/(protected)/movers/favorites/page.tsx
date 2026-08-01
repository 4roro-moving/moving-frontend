import type { Metadata } from "next";

import { PageHeader } from "@/components/common/PageHeader";
import FavoriteMoversContent from "@/components/mover/FavoriteMoversContent";

export const metadata: Metadata = {
  title: "찜한 기사님",
  description: "찜한 이사 기사님 목록을 확인하세요.",
};

export default function FavoriteMoversPage() {
  return (
    <div className="bg-background-subtle flex w-full flex-col">
      <PageHeader title="찜한 기사님" />
      <FavoriteMoversContent />
    </div>
  );
}
