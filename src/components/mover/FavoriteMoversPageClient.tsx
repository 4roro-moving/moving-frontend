"use client";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import FavoriteMoversContent, {
  FAVORITE_MOVERS_CONTENT_CLASSNAME,
} from "@/components/mover/FavoriteMoversContent";
import FavoriteMoversLoadingSkeleton from "@/components/mover/FavoriteMoversLoadingSkeleton";

export default function FavoriteMoversPageClient() {
  return (
    <CustomerAuthGate
      loadingFallback={
        <div className={FAVORITE_MOVERS_CONTENT_CLASSNAME}>
          <FavoriteMoversLoadingSkeleton />
        </div>
      }
    >
      <FavoriteMoversContent />
    </CustomerAuthGate>
  );
}
