import type { ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";

interface CustomerProtectedLayoutProps {
  children: ReactNode;
}

const CustomerProtectedLayout = ({ children }: CustomerProtectedLayoutProps) => {
  return <RoleGuard allowedRole="CUSTOMER">{children}</RoleGuard>;
};

export default CustomerProtectedLayout;
