import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/components/auth/AuthLayout";
import SocialSignUpForm from "@/components/auth/SocialSignUpForm";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth");

  return {
    title: t("metadata.customerSocialSignUpTitle"),
    description: t("metadata.customerSocialSignUpDescription"),
  };
};

const SocialSignUpPage = () => {
  return (
    <AuthLayout>
      <SocialSignUpForm audience="customer" />
    </AuthLayout>
  );
};

export default SocialSignUpPage;
