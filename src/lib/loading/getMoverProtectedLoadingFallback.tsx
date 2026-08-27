import type { ReactNode } from "react";

import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { ReceivedRequestsPageSkeleton } from "@/components/estimate/ReceivedRequestsSkeleton";
import MoverEstimateListPageSkeleton from "@/components/estimate/MoverEstimateListSkeleton";
import { MoverMyPageSkeleton } from "@/components/mover/mypage/MoverMyPageView";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface ProfileLoadingMessages {
  create: {
    title: string;
    description: string;
    loadingLabel: string;
  };
  basicInfo: {
    title: string;
    loadingLabel: string;
  };
  title: string;
  loadingLabel: string;
}

/** RoleGuard auth 대기 중 기사 protected layout용 로딩 UI
 *
 * pathname: 현재 페이지 경로
 */
export const getMoverProtectedLoadingFallback = (
  pathname: string,
  profileMessages: ProfileLoadingMessages,
): ReactNode => {
  if (pathname === APP_ROUTES.MOVER_ESTIMATES.RECEIVED_REQUESTS) {
    return <ReceivedRequestsPageSkeleton />;
  }

  if (
    pathname === APP_ROUTES.MOVER_ESTIMATES.SENT ||
    pathname === APP_ROUTES.MOVER_ESTIMATES.REJECTED
  ) {
    return <MoverEstimateListPageSkeleton />;
  }

  if (pathname === APP_ROUTES.MOVER_PROFILE) {
    return (
      <ProfileFormSkeleton
        title={profileMessages.create.title}
        description={profileMessages.create.description}
        loadingLabel={profileMessages.create.loadingLabel}
        layout="twoColumn"
      />
    );
  }

  if (pathname === APP_ROUTES.MOVER_PROFILE_EDIT) {
    return (
      <ProfileFormSkeleton
        title={profileMessages.title}
        loadingLabel={profileMessages.loadingLabel}
        layout="twoColumn"
      />
    );
  }

  if (pathname === APP_ROUTES.MOVER_BASIC_EDIT) {
    return (
      <ProfileFormSkeleton
        title={profileMessages.basicInfo.title}
        loadingLabel={profileMessages.basicInfo.loadingLabel}
        layout="twoColumn"
      />
    );
  }

  if (pathname === APP_ROUTES.MOVER_MYPAGE) {
    return <MoverMyPageSkeleton />;
  }

  return null;
};
