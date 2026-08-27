import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth");

  return {
    title: t("metadata.customerSignUpTitle"),
    description: t("metadata.customerSignUpDescription"),
  };
};

const SignUpPage = () => {
  return (
    <AuthLayout>
      <SignUpForm audience="customer" />
    </AuthLayout>
  );
};

export default SignUpPage;
