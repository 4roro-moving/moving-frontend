import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import SocialSignUpForm from "@/components/auth/SocialSignUpForm";

export const metadata: Metadata = {
  title: "소셜 회원가입 | 무빙",
  description: "무빙 고객 소셜 회원가입",
};

const SocialSignUpPage = () => {
  return (
    <AuthLayout>
      <SocialSignUpForm audience="customer" />
    </AuthLayout>
  );
};

export default SocialSignUpPage;
