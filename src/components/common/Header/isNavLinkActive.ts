import { APP_ROUTES } from "@/lib/constants/appRoutes";

/**
 * GNB 메뉴 활성 여부.
 * 찜한 기사님(`/movers/favorites`)은 프로필 메뉴 항목이므로
 * 기사님 찾기 활성 상태에서 제외합니다.
 */
export const isNavLinkActive = (pathname: string, href: string): boolean => {
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

  return true;
};
