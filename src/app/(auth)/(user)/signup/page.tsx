import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "회원가입 | 무빙",
  description: "무빙 고객 회원가입",
};

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUpPage;
