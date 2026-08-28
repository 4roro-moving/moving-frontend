"use client";

import { useTranslations } from "next-intl";

import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default function MyActivityTabs() {
  const t = useTranslations("myActivity");
  const items = [
    { href: APP_ROUTES.MY_ACTIVITY, label: t("tabs.residenceReviews"), match: "exact" as const },
    { href: APP_ROUTES.MY_ACTIVITY_GIVEAWAY, label: t("tabs.giveaways"), match: "exact" as const },
    {
      href: APP_ROUTES.MY_ACTIVITY_GIVEAWAY_REQUESTS,
      label: t("tabs.giveawayRequests"),
      match: "exact" as const,
    },
    {
      href: APP_ROUTES.REPORTS.ME,
      label: t("tabs.reports"),
      match: "exact" as const,
    },
  ];
  return <NavigationTabs ariaLabel={t("tabs.aria")} items={items} />;
}
