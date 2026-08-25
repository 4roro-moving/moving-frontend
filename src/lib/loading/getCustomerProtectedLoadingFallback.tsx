import { Suspense, type ReactNode } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import CommunityShell from "@/components/community/CommunityShell";
import GiveawayAuthLoadingFallback from "@/components/giveaway/GiveawayAuthLoadingFallback";
import GiveawayCardSkeletonList from "@/components/giveaway/GiveawayCardSkeletonList";
import GiveawayCreateButton from "@/components/giveaway/GiveawayCreateButton";
import GiveawayDetailSkeleton from "@/components/giveaway/GiveawayDetailSkeleton";
import GiveawayPageLayout from "@/components/giveaway/GiveawayPageLayout";
import MyGiveawayRequestCardSkeletonList from "@/components/giveaway/MyGiveawayRequestCardSkeletonList";
import MyGiveawayRequestFilters from "@/components/giveaway/MyGiveawayRequestFilters";
import { FAVORITE_MOVERS_CONTENT_CLASSNAME } from "@/components/mover/favorites/FavoriteMoversContent";
import FavoriteMoversLoadingSkeleton from "@/components/mover/favorites/FavoriteMoversLoadingSkeleton";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import MyActivityTabs from "@/components/residence-review/MyActivityTabs";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { GIVEAWAY_REQUEST_FILTER_DEFAULTS } from "@/lib/utils/giveawayRequestSearchParams";
import {
  GIVEAWAY_MY_FILTER_DEFAULTS,
  GIVEAWAY_SEARCH_DEFAULTS,
} from "@/lib/utils/giveawaySearchParams";

interface CustomerProfileLoadingMessages {
  create: {
    title: string;
    description: string;
    loadingLabel: string;
  };
  edit: {
    title: string;
    loadingLabel: string;
  };
}

/** RoleGuard auth 대기 중 고객 protected layout용 로딩 UI
 *
 * pathname: 현재 페이지 경로
 */
const isGiveawayListPath = (pathname: string): boolean => {
  return pathname === APP_ROUTES.COMMUNITY.GIVEAWAY;
};

const isGiveawayDetailPath = (pathname: string): boolean => {
  return pathname.startsWith(`${APP_ROUTES.COMMUNITY.GIVEAWAY}/`);
};

const isMyGiveawayPath = (pathname: string): boolean => {
  return pathname === APP_ROUTES.MY_ACTIVITY_GIVEAWAY;
};

const isMyGiveawayRequestPath = (pathname: string): boolean => {
  return pathname === APP_ROUTES.MY_ACTIVITY_GIVEAWAY_REQUESTS;
};

const GiveawayLoadingChrome = () => {
  return (
    <CommunityShell showGiveawayTab>
      <GiveawayPageLayout filters={GIVEAWAY_SEARCH_DEFAULTS}>
        <GiveawayCreateButton disabled />
        <GiveawayCardSkeletonList />
      </GiveawayPageLayout>
    </CommunityShell>
  );
};

const MyGiveawayLoadingChrome = () => {
  return (
    <>
      <MyActivityTabs />
      <GiveawayPageLayout variant="my" filters={GIVEAWAY_MY_FILTER_DEFAULTS}>
        <GiveawayCreateButton disabled />
        <GiveawayCardSkeletonList />
      </GiveawayPageLayout>
    </>
  );
};

const MyGiveawayRequestLoadingChrome = () => {
  return (
    <>
      <MyActivityTabs />
      <div className="bg-background-default flex w-full flex-col items-center">
        <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-24 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
          <MyGiveawayRequestFilters filters={GIVEAWAY_REQUEST_FILTER_DEFAULTS} />
          <MyGiveawayRequestCardSkeletonList />
        </div>
      </div>
    </>
  );
};

export const getCustomerProtectedLoadingFallback = (
  pathname: string,
  profileMessages: CustomerProfileLoadingMessages,
): ReactNode => {
  if (isGiveawayDetailPath(pathname)) {
    return (
      <CommunityShell showGiveawayTab>
        <GiveawayDetailSkeleton />
      </CommunityShell>
    );
  }

  if (isGiveawayListPath(pathname)) {
    return (
      <Suspense fallback={<GiveawayLoadingChrome />}>
        <GiveawayAuthLoadingFallback />
      </Suspense>
    );
  }

  if (isMyGiveawayPath(pathname)) {
    return <MyGiveawayLoadingChrome />;
  }

  if (isMyGiveawayRequestPath(pathname)) {
    return <MyGiveawayRequestLoadingChrome />;
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
        title={profileMessages.create.title}
        description={profileMessages.create.description}
        loadingLabel={profileMessages.create.loadingLabel}
        layout="single"
      />
    );
  }

  if (pathname === APP_ROUTES.PROFILE_EDIT) {
    return (
      <ProfileFormSkeleton
        title={profileMessages.edit.title}
        loadingLabel={profileMessages.edit.loadingLabel}
        layout="twoColumn"
      />
    );
  }

  return null;
};
