import type { ReactNode } from "react";

import CommunityShell from "@/components/community/CommunityShell";

interface CustomerCommunityLayoutProps {
  children: ReactNode;
}

const CustomerCommunityLayout = ({ children }: CustomerCommunityLayoutProps) => {
  return <CommunityShell showGiveawayTab>{children}</CommunityShell>;
};

export default CustomerCommunityLayout;
