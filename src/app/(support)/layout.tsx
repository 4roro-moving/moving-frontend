import type { ReactNode } from "react";

import SupportNavigation from "@/components/support/SupportNavigation";

interface SupportLayoutProps {
  children: ReactNode;
}

export default function SupportLayout({ children }: SupportLayoutProps) {
  return (
    <>
      <SupportNavigation />
      {children}
    </>
  );
}
