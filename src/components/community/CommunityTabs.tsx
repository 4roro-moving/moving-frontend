"use client";

import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";
import type { AuthRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

const RESIDENCE_REVIEW_TAB: NavigationTabItem = {
  href: APP_ROUTES.COMMUNITY.RESIDENCE_REVIEWS,
  label: "거주 후기",
};

const GIVEAWAY_TAB: NavigationTabItem = {
  href: APP_ROUTES.COMMUNITY.GIVEAWAY,
  label: "나눔",
};

interface CommunityTabsProps {
  /** SSR role 쿠키 힌트. 공개 커뮤니티에서 나눔 탭 Soft UX에 사용합니다. */
  initialRole?: AuthRole | null;
  /** true면 인증 대기 없이 나눔 탭을 보여 줍니다. 고객 전용 나눔 layout에서 사용합니다. */
  showGiveawayTab?: boolean;
}

const CommunityTabs = ({ initialRole = null, showGiveawayTab }: CommunityTabsProps) => {
  const resolvedRole = useResolvedAuthRole(initialRole);
  const canShowGiveawayTab = showGiveawayTab ?? resolvedRole === "CUSTOMER";
  const items: readonly NavigationTabItem[] = canShowGiveawayTab
    ? [RESIDENCE_REVIEW_TAB, GIVEAWAY_TAB]
    : [RESIDENCE_REVIEW_TAB];

  return <NavigationTabs ariaLabel="커뮤니티" items={items} />;
};

export default CommunityTabs;
