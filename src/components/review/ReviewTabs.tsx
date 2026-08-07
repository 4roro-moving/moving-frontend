import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS = [
  { href: APP_ROUTES.REVIEWS.WRITABLE, label: "작성 가능한 리뷰" },
  { href: APP_ROUTES.REVIEWS.ME, label: "내가 작성한 리뷰" },
] as const;

export default function ReviewTabs() {
  return <NavigationTabs ariaLabel="리뷰 관리" items={TABS} />;
}
