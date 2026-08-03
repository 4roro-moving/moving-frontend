"use client";

import FavoriteMoversToolbar from "@/components/mover/favorites/FavoriteMoversToolbar";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";

export default function FavoriteMoversLoadingSkeleton() {
  return (
    <div
      className="flex flex-col gap-10 min-[744px]:gap-18 lg:gap-28"
      aria-busy="true"
      aria-label="찜한 기사님을 불러오는 중"
    >
      <FavoriteMoversToolbar
        selectedCount={0}
        totalCount={0}
        isAllSelected={false}
        disabled
        onSelectAll={() => undefined}
        onBulkDelete={() => undefined}
      />
      <MoverCardSkeletonList
        variant="full"
        count={FAVORITE_MOVERS_PAGE_LIMIT}
        showSelection
        className="gap-20 min-[744px]:gap-24 lg:gap-20"
        label="찜한 기사님을 불러오는 중"
      />
    </div>
  );
}
