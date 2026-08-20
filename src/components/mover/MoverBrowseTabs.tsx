import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS = [
  { href: APP_ROUTES.MOVERS.ROOT, label: "조건으로 찾기", match: "exact" },
  { href: APP_ROUTES.MOVERS.MAP, label: "지역으로 찾기", match: "exact" },
] as const;

export default function MoverBrowseTabs() {
  return <NavigationTabs ariaLabel="기사님 탐색" items={TABS} />;
}
