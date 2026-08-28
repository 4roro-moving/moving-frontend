import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import MyReportsNavigation from "@/components/report/MyReportsNavigation";
import MyReportsPageClient from "@/components/report/MyReportsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("report");

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function MyReportsPage() {
  return (
    <>
      <MyReportsNavigation />
      <MyReportsPageClient />
    </>
  );
}
