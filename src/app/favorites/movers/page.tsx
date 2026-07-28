import type { Metadata } from "next";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

export const metadata: Metadata = {
  title: "찜한 기사님",
  description: "찜한 이사 기사님 목록을 확인하세요.",
};

/**
 * 찜한 기사님 전체 목록 페이지.
 *
 * NOTE: UI 본문·라우트 경로 모두 임시, 경로 확정 후 `APP_ROUTES.FAVORITE_MOVERS`와 현재 파일 변경해야 함
 */
export default function FavoriteMoversPage() {
  return (
    <div className="bg-background-default flex w-full flex-col">
      <div className="hidden lg:block">
        <PageHeader title="찜한 기사님" />
      </div>

      <div className="px-margin-mobile mx-auto w-full max-w-[var(--container-desktop)] min-[744px]:px-72 lg:px-0">
        <EmptyState
          size="sm"
          imageSrc="/images/empty/character.png"
          description={
            <>
              찜한 기사님 페이지는 준비 중이에요.
              <br />곧 만나볼 수 있어요.
            </>
          }
          buttonLabel="기사님 찾기로 돌아가기"
          href={APP_ROUTES.MOVERS.ROOT}
        />
      </div>
    </div>
  );
}
