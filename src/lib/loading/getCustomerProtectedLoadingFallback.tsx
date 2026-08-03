import type { ReactNode } from "react";

import { PageHeader } from "@/components/common/PageHeader";
import { FAVORITE_MOVERS_CONTENT_CLASSNAME } from "@/components/mover/favorites/FavoriteMoversContent";
import FavoriteMoversLoadingSkeleton from "@/components/mover/favorites/FavoriteMoversLoadingSkeleton";
import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

/** RoleGuard auth 대기 중 고객 protected layout용 로딩 UI
 *
 * pathname: 현재 페이지 경로
 */
export const getCustomerProtectedLoadingFallback = (pathname: string): ReactNode => {
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
