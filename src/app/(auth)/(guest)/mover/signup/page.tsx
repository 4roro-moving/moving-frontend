import type { Metadata } from "next";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "기사님 회원가입 | 무빙",
  description: "무빙 기사님 회원가입",
};

const MoverSignUpPage = () => {
  return (
    <AuthLayout>
      <SignUpForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverSignUpPage;
