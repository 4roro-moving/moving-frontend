import type { ReactNode } from "react";

interface AuthRouteLayoutProps {
  children: ReactNode;
}

/** (auth) 공통 껍데기 — GuestOnly는 (guest)에만 적용 */
const AuthRouteLayout = ({ children }: AuthRouteLayoutProps) => {
  return children;
};

export default AuthRouteLayout;
