import type { ReactNode } from "react";

import CommunityShell from "@/components/community/CommunityShell";

const CommunityLayout = ({ children }: { children: ReactNode }) => {
  return <CommunityShell>{children}</CommunityShell>;
};

export default CommunityLayout;
