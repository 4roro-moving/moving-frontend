import type { ReactNode } from "react";

import { LoginRequiredModalProvider } from "@/components/auth/LoginRequiredModalProvider";

interface MoversLayoutProps {
  children: ReactNode;
}

export default function MoversLayout({ children }: MoversLayoutProps) {
  return <LoginRequiredModalProvider>{children}</LoginRequiredModalProvider>;
}
