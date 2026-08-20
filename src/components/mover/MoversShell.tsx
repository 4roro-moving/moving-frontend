"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import MoverBrowseTabs from "@/components/mover/MoverBrowseTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface MoversShellProps {
  children: ReactNode;
}

const shouldShowTabs = (pathname: string): boolean =>
  pathname === APP_ROUTES.MOVERS.ROOT || pathname === APP_ROUTES.MOVERS.MAP;

export default function MoversShell({ children }: MoversShellProps) {
  const pathname = usePathname();

  return (
    <>
      {shouldShowTabs(pathname) ? <MoverBrowseTabs /> : null}
      {children}
    </>
  );
}
