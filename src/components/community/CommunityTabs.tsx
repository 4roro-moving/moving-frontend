import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS: readonly NavigationTabItem[] = [
  { href: APP_ROUTES.COMMUNITY.RESIDENCE_REVIEWS, label: "거주 후기" },
  { href: APP_ROUTES.COMMUNITY.GIVEAWAY, label: "나눔", disabled: true },
];

const CommunityTabs = () => {
  return <NavigationTabs ariaLabel="커뮤니티" items={TABS} />;
};

export default CommunityTabs;
