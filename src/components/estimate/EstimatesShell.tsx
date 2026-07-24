"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import MyEstimateTabs from "@/components/estimate/MyEstimateTabs";

interface EstimatesShellProps {
  children: ReactNode;
}

// 2026.07.24 정슬기 - [수정] /estimates/[estimateId] 상세에서는 목록 탭을 숨김
function shouldShowTabs(pathname: string): boolean {
  return (
    pathname === "/estimates/pending" ||
    pathname === "/estimates/received" ||
    pathname.startsWith("/estimates/pending/") ||
    pathname.startsWith("/estimates/received/")
  );
}

export default function EstimatesShell({ children }: EstimatesShellProps) {
  const pathname = usePathname();

  return (
    <>
      {shouldShowTabs(pathname) ? <MyEstimateTabs /> : null}
      {children}
    </>
  );
}
