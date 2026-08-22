import type { ReactNode } from "react";

import RoleGuard from "@/components/auth/RoleGuard";

interface InquiryLayoutProps {
  children: ReactNode;
}

export default function InquiryLayout({ children }: InquiryLayoutProps) {
  return <RoleGuard allowedRole={["CUSTOMER", "MOVER"]}>{children}</RoleGuard>;
}
