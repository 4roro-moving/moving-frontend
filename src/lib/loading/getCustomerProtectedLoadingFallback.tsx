import { Suspense, type ReactNode } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import CommunityShell from "@/components/community/CommunityShell";
import GiveawayAuthLoadingFallback from "@/components/giveaway/GiveawayAuthLoadingFallback";
import GiveawayCardSkeletonList from "@/components/giveaway/GiveawayCardSkeletonList";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import { FAVORITE_MOVERS_CONTENT_CLASSNAME } from "@/components/mover/favorites/FavoriteMoversContent";
import FavoriteMoversLoadingSkeleton from "@/components/mover/favorites/FavoriteMoversLoadingSkeleton";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { GIVEAWAY_SEARCH_DEFAULTS } from "@/lib/utils/giveawaySearchParams";

/** RoleGuard auth 대기 중 고객 protected layout용 로딩 UI
 *
 * pathname: 현재 페이지 경로
 */
const isGiveawayPath = (pathname: string): boolean => {
  return (
    pathname === APP_ROUTES.COMMUNITY.GIVEAWAY ||
    pathname.startsWith(`${APP_ROUTES.COMMUNITY.GIVEAWAY}/`)
  );
};

const GiveawayLoadingChrome = () => {
  return (
    <CommunityShell showGiveawayTab>
      <GiveawayPageLayout filters={GIVEAWAY_SEARCH_DEFAULTS}>
        <GiveawayCardSkeletonList />
      </GiveawayPageLayout>
    </CommunityShell>
  );
};

export const getCustomerProtectedLoadingFallback = (pathname: string): ReactNode => {
  if (isGiveawayPath(pathname)) {
    return (
      <Suspense fallback={<GiveawayLoadingChrome />}>
        <GiveawayAuthLoadingFallback />
      </Suspense>
    );
  }

  if (pathname === APP_ROUTES.MOVERS.FAVORITES) {
    return (
      <div className="bg-background-subtle flex w-full flex-col">
        <PageHeader title="찜한 기사님" />
        <div className={FAVORITE_MOVERS_CONTENT_CLASSNAME}>
          <FavoriteMoversLoadingSkeleton />
        </div>
      </div>
    );
  }

  if (pathname === APP_ROUTES.PROFILE) {
    return (
      <ProfileFormSkeleton
        title="프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
        layout="single"
      />
    );
  }

  if (pathname === APP_ROUTES.PROFILE_EDIT) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  return null;
};
