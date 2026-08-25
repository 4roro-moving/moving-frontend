import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default async function MyEstimateTabs() {
  const t = await getTranslations("estimates");
  const tabs = [
    { href: APP_ROUTES.ESTIMATES.PENDING, label: t("tabs.pending") },
    { href: APP_ROUTES.ESTIMATES.RECEIVED, label: t("tabs.received") },
    { href: APP_ROUTES.ESTIMATES.REQUESTS, label: t("tabs.requests") },
  ];
  return <NavigationTabs ariaLabel={t("tabs.label")} items={tabs} />;
}
import { getTranslations } from "next-intl/server";
