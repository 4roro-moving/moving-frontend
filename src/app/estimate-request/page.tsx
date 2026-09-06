import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import EstimateRequestForm from "@/components/estimate/request/EstimateRequestForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimateRequest");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  };
}

export default async function EstimateRequestPage() {
  const t = await getTranslations("estimateRequest");
  return (
    <CustomerAuthGate loadingMessage={t("loading")}>
      <main className="bg-background-subtle min-h-screen md:px-40 md:py-64">
        <EstimateRequestForm />
      </main>
    </CustomerAuthGate>
  );
}
