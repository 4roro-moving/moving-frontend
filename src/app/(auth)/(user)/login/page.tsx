import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "로그인 | 무빙",
  description: "무빙 고객 로그인",
};

const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm audience="customer" />
    </AuthLayout>
  );
};

export default LoginPage;
