import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");

  return {
    title: t("moverLoginMetadataTitle"),
    description: t("moverLoginMetadataDescription"),
  };
}

const MoverLoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm audience="mover" />
    </AuthLayout>
  );
};

export default MoverLoginPage;
