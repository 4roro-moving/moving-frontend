"use client";

import { useTranslations } from "next-intl";

import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default function MoverBrowseTabs() {
  const t = useTranslations("moverSearch");
  const items = [
    { href: APP_ROUTES.MOVERS.ROOT, label: t("tabs.conditions"), match: "exact" as const },
    { href: APP_ROUTES.MOVERS.MAP, label: t("tabs.region"), match: "exact" as const },
  ];

  return <NavigationTabs ariaLabel={t("tabs.aria")} items={items} />;
}
