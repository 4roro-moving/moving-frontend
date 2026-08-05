"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ProfileCompletionGuard from "@/components/auth/ProfileCompletionGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { getMoverProtectedLoadingFallback } from "@/lib/loading/getMoverProtectedLoadingFallback";

interface MoverProtectedLayoutProps {
  children: ReactNode;
}

const MoverProtectedLayout = ({ children }: MoverProtectedLayoutProps) => {
  const pathname = usePathname();
  const loadingFallback = getMoverProtectedLoadingFallback(pathname);

  return (
    <RoleGuard allowedRole="MOVER" loadingFallback={loadingFallback}>
      <ProfileCompletionGuard loadingFallback={loadingFallback}>{children}</ProfileCompletionGuard>
    </RoleGuard>
  );
};

export default MoverProtectedLayout;
