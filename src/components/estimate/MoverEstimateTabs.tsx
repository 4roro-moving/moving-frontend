import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export default async function MoverEstimateTabs() {
  const t = await getTranslations("estimates");
  const tabs = [
    { href: APP_ROUTES.MOVER_ESTIMATES.SENT, label: t("tabs.sent"), match: "exact" as const },
    {
      href: APP_ROUTES.MOVER_ESTIMATES.REJECTED,
      label: t("tabs.rejected"),
      match: "exact" as const,
    },
  ];
  return <NavigationTabs ariaLabel={t("tabs.moverLabel")} items={tabs} />;
}
import { getTranslations } from "next-intl/server";
