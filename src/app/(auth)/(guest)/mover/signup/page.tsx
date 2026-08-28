import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/components/auth/AuthLayout";
import SignUpForm from "@/components/auth/SignUpForm";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations("auth");

  return {
    title: t("metadata.moverSignUpTitle"),
    description: t("metadata.moverSignUpDescription"),
  };
};

const MoverSignUpPage = () => {
  return (
    <AuthLayout>
      <SignUpForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverSignUpPage;
