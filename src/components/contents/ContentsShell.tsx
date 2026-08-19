import type { ReactNode } from "react";

import ContentTabs from "@/components/contents/ContentTabs";

interface ContentsShellProps {
  children: ReactNode;
}

const ContentsShell = ({ children }: ContentsShellProps) => {
  return (
    <>
      <ContentTabs />
      {children}
    </>
  );
};

export default ContentsShell;
