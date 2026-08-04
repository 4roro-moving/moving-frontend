import type { ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";

interface AdminProtectedLayoutProps {
  children: ReactNode;
}

export default function AdminProtectedLayout({ children }: AdminProtectedLayoutProps) {
  return <RoleGuard allowedRole="ADMIN">{children}</RoleGuard>;
}
