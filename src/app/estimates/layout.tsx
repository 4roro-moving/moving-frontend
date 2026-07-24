import type { ReactNode } from "react";

import EstimatesShell from "@/components/estimate/EstimatesShell";

interface EstimatesLayoutProps {
  children: ReactNode;
}

export default function EstimatesLayout({ children }: EstimatesLayoutProps) {
  return <EstimatesShell>{children}</EstimatesShell>;
}
