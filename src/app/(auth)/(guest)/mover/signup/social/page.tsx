import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import SocialSignUpForm from "@/components/auth/SocialSignUpForm";

export const metadata: Metadata = {
  title: "기사님 소셜 회원가입 | 무빙",
  description: "무빙 기사님 소셜 회원가입",
};

const MoverSocialSignUpPage = () => {
  return (
    <AuthLayout>
      <SocialSignUpForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverSocialSignUpPage;
