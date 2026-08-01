import type { ReactNode } from "react";

import GuestOnly from "@/components/auth/GuestOnly";

interface GuestAuthLayoutProps {
  children: ReactNode;
}

/** 로그인/회원가입 — 이미 로그인된 사용자는 역할 홈으로 보냅니다. */
const GuestAuthLayout = ({ children }: GuestAuthLayoutProps) => {
  return <GuestOnly>{children}</GuestOnly>;
};

export default GuestAuthLayout;
