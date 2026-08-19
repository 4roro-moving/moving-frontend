import { APP_ROUTES } from "@/lib/constants/appRoutes";

/**
 * GNB 메뉴 활성 여부.
 * 찜한 기사님(`/movers/favorites`)은 프로필 메뉴 항목이므로
 * 기사님 찾기 활성 상태에서 제외합니다.
 * 보낸 견적(`/estimate/sent`)은 별도 GNB 항목이므로
 * 받은 요청(ROOT) 활성 상태에서 제외합니다.
 * 콘텐츠 GNB는 거주후기로 진입하지만 `/contents` 하위에서도 활성으로 표시합니다.
 */
export const isNavLinkActive = (pathname: string, href: string): boolean => {
  if (href === APP_ROUTES.CONTENTS.RESIDENCE_REVIEWS) {
    return (
      pathname === APP_ROUTES.CONTENTS.ROOT || pathname.startsWith(`${APP_ROUTES.CONTENTS.ROOT}/`)
    );
  }

  if (pathname === href) {
    return true;
  }

  if (!pathname.startsWith(`${href}/`)) {
    return false;
  }

  if (href === APP_ROUTES.MOVERS.ROOT) {
    const favoritesPath = APP_ROUTES.MOVERS.FAVORITES;

    if (pathname === favoritesPath || pathname.startsWith(`${favoritesPath}/`)) {
      return false;
    }
  }

  if (href === APP_ROUTES.MOVER_ESTIMATES.ROOT) {
    const sentPath = APP_ROUTES.MOVER_ESTIMATES.SENT;

    if (pathname === sentPath || pathname.startsWith(`${sentPath}/`)) {
      return false;
    }
  }

  return true;
};
