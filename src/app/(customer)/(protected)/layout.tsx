"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ProfileCompletionGuard from "@/components/auth/ProfileCompletionGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { getCustomerProtectedLoadingFallback } from "@/lib/loading/getCustomerProtectedLoadingFallback";

interface CustomerProtectedLayoutProps {
  children: ReactNode;
}

const CustomerProtectedLayout = ({ children }: CustomerProtectedLayoutProps) => {
  const pathname = usePathname();
  const loadingFallback = getCustomerProtectedLoadingFallback(pathname);

  return (
    <RoleGuard allowedRole="CUSTOMER" loadingFallback={loadingFallback}>
      <ProfileCompletionGuard loadingFallback={loadingFallback}>{children}</ProfileCompletionGuard>
    </RoleGuard>
  );
};

export default CustomerProtectedLayout;
