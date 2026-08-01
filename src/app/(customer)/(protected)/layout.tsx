"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import RoleGuard from "@/components/auth/RoleGuard";
import { PageHeader } from "@/components/common/PageHeader";
import FavoriteMoversLoadingSkeleton from "@/components/mover/FavoriteMoversLoadingSkeleton";
import { FAVORITE_MOVERS_CONTENT_CLASSNAME } from "@/components/mover/FavoriteMoversContent";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface CustomerProtectedLayoutProps {
  children: ReactNode;
}

const CustomerProtectedLayout = ({ children }: CustomerProtectedLayoutProps) => {
  const pathname = usePathname();
  const loadingFallback =
    pathname === APP_ROUTES.MOVERS.FAVORITES ? (
      <div className="bg-background-subtle flex w-full flex-col">
        <PageHeader title="찜한 기사님" />
        <div className={FAVORITE_MOVERS_CONTENT_CLASSNAME}>
          <FavoriteMoversLoadingSkeleton />
        </div>
      </div>
    ) : null;

  return (
    <RoleGuard allowedRole="CUSTOMER" loadingFallback={loadingFallback}>
      {children}
    </RoleGuard>
  );
};

export default CustomerProtectedLayout;
