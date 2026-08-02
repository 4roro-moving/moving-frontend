import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "기사님 로그인 | 무빙",
  description: "무빙 기사님 로그인",
};

const MoverLoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverLoginPage;
