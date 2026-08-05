"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import RoleGuard from "@/components/auth/RoleGuard";
import { getMoverProtectedLoadingFallback } from "@/lib/loading/getMoverProtectedLoadingFallback";

interface MoverProtectedLayoutProps {
  children: ReactNode;
}

const MoverProtectedLayout = ({ children }: MoverProtectedLayoutProps) => {
  const pathname = usePathname();

  return (
    <RoleGuard allowedRole="MOVER" loadingFallback={getMoverProtectedLoadingFallback(pathname)}>
      {children}
    </RoleGuard>
  );
};

export default MoverProtectedLayout;
