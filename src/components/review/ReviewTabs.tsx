"use client";

import { useTranslations } from "next-intl";

import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default function ReviewTabs() {
  const t = useTranslations("reviews");
  return (
    <NavigationTabs
      ariaLabel={t("tabsAria")}
      items={[
        { href: APP_ROUTES.REVIEWS.WRITABLE, label: t("writableTitle") },
        { href: APP_ROUTES.REVIEWS.ME, label: t("myTitle") },
      ]}
    />
  );
}
