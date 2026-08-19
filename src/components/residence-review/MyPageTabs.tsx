import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS: readonly NavigationTabItem[] = [
  { href: APP_ROUTES.MY_PAGE, label: "내가 작성한 거주후기" },
  { href: `${APP_ROUTES.MY_PAGE}/giveaway`, label: "내가 작성한 나눔글", disabled: true },
];

const MyPageTabs = () => {
  return <NavigationTabs ariaLabel="마이페이지" items={TABS} />;
};

export default MyPageTabs;
