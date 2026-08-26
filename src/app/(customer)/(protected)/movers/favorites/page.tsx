import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import { PageHeader } from "@/components/common/PageHeader";
import FavoriteMoversContent from "@/components/mover/favorites/FavoriteMoversContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("favorites");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

export default async function FavoriteMoversPage() {
  const t = await getTranslations("favorites");

  return (
    <div className="bg-background-subtle flex w-full flex-col">
      <PageHeader title={t("title")} />
      <FavoriteMoversContent />
    </div>
  );
}
