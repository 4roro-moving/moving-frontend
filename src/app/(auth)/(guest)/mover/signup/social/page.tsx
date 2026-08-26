import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/components/auth/AuthLayout";
import SocialSignUpForm from "@/components/auth/SocialSignUpForm";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth");

  return {
    title: t("metadata.moverSocialSignUpTitle"),
    description: t("metadata.moverSocialSignUpDescription"),
  };
};

const MoverSocialSignUpPage = () => {
  return (
    <AuthLayout>
      <SocialSignUpForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverSocialSignUpPage;
