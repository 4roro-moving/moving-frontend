"use client";

import FavoriteMoversToolbar from "@/components/mover/FavoriteMoversToolbar";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";

const LIST_SKELETON_COUNT = 3;

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
        count={LIST_SKELETON_COUNT}
        showSelection
        className="gap-20 min-[744px]:gap-24 lg:gap-20"
        label="찜한 기사님을 불러오는 중"
      />
    </div>
  );
}
