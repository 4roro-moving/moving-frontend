"use client";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { PageHeader } from "@/components/common/PageHeader";
import FavoriteMoversContent, {
  FAVORITE_MOVERS_CONTENT_CLASSNAME,
} from "@/components/mover/FavoriteMoversContent";
import FavoriteMoversLoadingSkeleton from "@/components/mover/FavoriteMoversLoadingSkeleton";

export default function FavoriteMoversPageClient() {
  return (
    <div className="bg-background-subtle flex w-full flex-col">
      <PageHeader title="찜한 기사님" />
      <CustomerAuthGate
        loadingFallback={
          <div className={FAVORITE_MOVERS_CONTENT_CLASSNAME}>
            <FavoriteMoversLoadingSkeleton />
          </div>
        }
      >
        <FavoriteMoversContent />
      </CustomerAuthGate>
    </div>
  );
}
