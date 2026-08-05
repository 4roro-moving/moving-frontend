import type { ReactNode } from "react";

import ProfileFormSkeleton from "@/components/profile/ProfileFormSkeleton";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

/** RoleGuard auth 대기 중 기사 protected layout용 로딩 UI
 *
 * pathname: 현재 페이지 경로
 */
export const getMoverProtectedLoadingFallback = (pathname: string): ReactNode => {
  if (pathname === APP_ROUTES.MOVER_PROFILE) {
    return (
      <ProfileFormSkeleton
        title="기사님 프로필 등록"
        description="추가 정보를 입력하여 회원가입을 완료해주세요."
        layout="twoColumn"
      />
    );
  }

  if (pathname === APP_ROUTES.MOVER_PROFILE_EDIT) {
    return <ProfileFormSkeleton title="프로필 수정" layout="twoColumn" />;
  }

  if (pathname === APP_ROUTES.MOVER_BASIC_EDIT) {
    return <ProfileFormSkeleton title="기본정보 수정" layout="twoColumn" />;
  }

  return null;
};
