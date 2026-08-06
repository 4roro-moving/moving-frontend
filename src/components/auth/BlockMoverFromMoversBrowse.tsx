"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { getRoleHomePath } from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";

interface BlockMoverFromMoversBrowseProps {
  children: ReactNode;
}

/**
 * 기사님 찾기·상세 등 `/movers` 공개 탐색은 고객/비로그인 전용.
 * MOVER가 히스토리·URL로 진입하면 역할 홈으로 보냅니다.
 */
const BlockMoverFromMoversBrowse = ({ children }: BlockMoverFromMoversBrowseProps) => {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.user?.role);

  const shouldBlock = hasHydrated && !isCheckingAuth && isAuthenticated && role === "MOVER";

  useEffect(() => {
    if (!shouldBlock) return;
    router.replace(getRoleHomePath("MOVER"));
  }, [shouldBlock, router]);

  if (shouldBlock) {
    return null;
  }

  return children;
};

export default BlockMoverFromMoversBrowse;
