"use client";

import NavigationTabs, {
  type NavigationTabItem,
} from "@/components/common/NavigationTabs/NavigationTabs";
import { useTranslations } from "next-intl";
import { useResolvedAuthRole } from "@/hooks/auth/useResolvedAuthRole";
import type { AuthRole } from "@/lib/auth/role";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface CommunityTabsProps {
  /** SSR role 쿠키 힌트. 공개 커뮤니티에서 나눔 탭 Soft UX에 사용합니다. */
  initialRole?: AuthRole | null;
  /** true면 인증 대기 없이 나눔 탭을 보여 줍니다. 고객 전용 나눔 layout에서 사용합니다. */
  showGiveawayTab?: boolean;
}

const CommunityTabs = ({ initialRole = null, showGiveawayTab }: CommunityTabsProps) => {
  const t = useTranslations("community");
  const resolvedRole = useResolvedAuthRole(initialRole);
  const canShowGiveawayTab = showGiveawayTab ?? resolvedRole === "CUSTOMER";
  const items: readonly NavigationTabItem[] = canShowGiveawayTab
    ? [
        { href: APP_ROUTES.COMMUNITY.RESIDENCE_REVIEWS, label: t("residenceReviews") },
        { href: APP_ROUTES.COMMUNITY.GIVEAWAY, label: t("giveaway") },
      ]
    : [{ href: APP_ROUTES.COMMUNITY.RESIDENCE_REVIEWS, label: t("residenceReviews") }];

  return <NavigationTabs ariaLabel={t("tabsAria")} items={items} />;
};

export default CommunityTabs;
