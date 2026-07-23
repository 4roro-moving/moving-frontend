import type { ReactNode } from "react";

import MyEstimateTabs from "@/components/estimate/MyEstimateTabs";

interface EstimatesLayoutProps {
  children: ReactNode;
}

export default function EstimatesLayout({ children }: EstimatesLayoutProps) {
  return (
    <>
      <MyEstimateTabs />
      {children}
    </>
  );
}
