"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import RoleGuard from "@/components/auth/RoleGuard";
import { getCustomerProtectedLoadingFallback } from "@/lib/loading/getCustomerProtectedLoadingFallback";

interface CustomerProtectedLayoutProps {
  children: ReactNode;
}

const CustomerProtectedLayout = ({ children }: CustomerProtectedLayoutProps) => {
  const pathname = usePathname();

  return (
    <RoleGuard
      allowedRole="CUSTOMER"
      loadingFallback={getCustomerProtectedLoadingFallback(pathname)}
    >
      {children}
    </RoleGuard>
  );
};

export default CustomerProtectedLayout;
