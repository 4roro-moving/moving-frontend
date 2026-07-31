import type { ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";

interface MoverProtectedLayoutProps {
  children: ReactNode;
}

const MoverProtectedLayout = ({ children }: MoverProtectedLayoutProps) => {
  return <RoleGuard allowedRole="MOVER">{children}</RoleGuard>;
};

export default MoverProtectedLayout;
