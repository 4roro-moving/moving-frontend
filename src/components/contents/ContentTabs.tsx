import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const TABS: readonly NavigationTabItem[] = [
  { href: APP_ROUTES.CONTENTS.RESIDENCE_REVIEWS, label: "거주 후기" },
  { href: APP_ROUTES.CONTENTS.GIVEAWAY, label: "나눔", disabled: true },
];

const ContentTabs = () => {
  return <NavigationTabs ariaLabel="콘텐츠" items={TABS} />;
};

export default ContentTabs;
