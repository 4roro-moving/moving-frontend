import type { ReactNode } from "react";

import BlockMoverFromMoversBrowse from "@/components/auth/BlockMoverFromMoversBrowse";
import { LoginRequiredModalProvider } from "@/components/auth/LoginRequiredModalProvider";

interface MoversLayoutProps {
  children: ReactNode;
}

export default function MoversLayout({ children }: MoversLayoutProps) {
  return (
    <LoginRequiredModalProvider>
      <BlockMoverFromMoversBrowse>{children}</BlockMoverFromMoversBrowse>
    </LoginRequiredModalProvider>
  );
}
