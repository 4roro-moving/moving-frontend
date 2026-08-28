import type { ReactNode } from "react";

import CommunityTabs from "@/components/community/CommunityTabs";
import type { AuthRole } from "@/lib/auth/role";

interface CommunityShellProps {
  children: ReactNode;
  initialRole?: AuthRole | null;
  showGiveawayTab?: boolean;
}

const CommunityShell = ({ children, initialRole = null, showGiveawayTab }: CommunityShellProps) => {
  return (
    <>
      <CommunityTabs initialRole={initialRole} showGiveawayTab={showGiveawayTab} />
      {children}
    </>
  );
};

export default CommunityShell;
