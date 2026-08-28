"use client";

import FavoriteMoversToolbar from "@/components/mover/favorites/FavoriteMoversToolbar";
import { useTranslations } from "next-intl";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { FAVORITE_MOVERS_PAGE_LIMIT } from "@/lib/api/favorites";

export default function FavoriteMoversLoadingSkeleton() {
  const t = useTranslations("favorites");
  return (
    <div
      className="flex flex-col gap-10 md:gap-18 xl:gap-28"
      aria-busy="true"
      aria-label={t("loading")}
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
        className="gap-20 md:gap-24 xl:gap-20"
        label={t("loading")}
      />
    </div>
  );
}
