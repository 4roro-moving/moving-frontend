import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS = [
  { href: APP_ROUTES.ESTIMATES.PENDING, label: "대기 중인 견적" },
  { href: APP_ROUTES.ESTIMATES.RECEIVED, label: "받았던 견적" },
  { href: APP_ROUTES.ESTIMATES.REQUESTS, label: "보낸 견적 요청" },
] as const;

export default function MyEstimateTabs() {
  return <NavigationTabs ariaLabel="내 견적 관리" items={TABS} />;
}
