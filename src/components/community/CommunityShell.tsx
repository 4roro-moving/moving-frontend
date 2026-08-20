import type { ReactNode } from "react";

import CommunityTabs from "@/components/community/CommunityTabs";

interface CommunityShellProps {
  children: ReactNode;
}

const CommunityShell = ({ children }: CommunityShellProps) => {
  return (
    <>
      <CommunityTabs />
      {children}
    </>
  );
};

export default CommunityShell;
