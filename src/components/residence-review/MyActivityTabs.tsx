import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS: readonly NavigationTabItem[] = [
  { href: APP_ROUTES.MY_ACTIVITY, label: "내가 작성한 거주후기", match: "exact" },
  { href: APP_ROUTES.MY_ACTIVITY_GIVEAWAY, label: "내가 작성한 나눔글" },
];

const MyActivityTabs = () => {
  return <NavigationTabs ariaLabel="내 활동 내역" items={TABS} />;
};

export default MyActivityTabs;
