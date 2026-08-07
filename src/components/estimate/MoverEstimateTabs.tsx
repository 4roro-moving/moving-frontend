import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS = [
  { href: APP_ROUTES.MOVER_ESTIMATES.SENT, label: "보낸 견적 조회", match: "exact" },
  { href: APP_ROUTES.MOVER_ESTIMATES.REJECTED, label: "반려 요청", match: "exact" },
] as const;

export default function MoverEstimateTabs() {
  return <NavigationTabs ariaLabel="기사님 내 견적 관리" items={TABS} />;
}
