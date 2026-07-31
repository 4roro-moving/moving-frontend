import type { ReactNode } from "react";

import GuestOnly from "@/components/auth/GuestOnly";

interface AuthRouteLayoutProps {
  children: ReactNode;
}

const AuthRouteLayout = ({ children }: AuthRouteLayoutProps) => {
  return <GuestOnly>{children}</GuestOnly>;
};

export default AuthRouteLayout;
