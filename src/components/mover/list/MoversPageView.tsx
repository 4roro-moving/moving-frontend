import { PageHeader } from "@/components/common/PageHeader";

import { FavoriteMoversSidebar } from "@/components/mover/favorites/FavoriteMoversSidebar";
import { MoversFilters } from "@/components/mover/list/MoversFilters";
import { MoversList } from "@/components/mover/list/MoversList";
import type { MoversSearchParamsState } from "@/lib/utils/moversSearchParams";
import type { Mover } from "@/types/mover";

interface MoversPageViewProps {
  filters: MoversSearchParamsState;
  /** 서버에서 prefetch한 공개 목록. 인증 초기화 중 첫 화면을 즉시 렌더링. */
  initialMovers: Mover[];
}

export function MoversPageView({ filters, initialMovers }: MoversPageViewProps) {
  return (
    <div className="bg-background-default flex w-full flex-col">
      <div className="hidden xl:block">
        <PageHeader title="기사님 찾기" />
      </div>

      <div className="px-margin-mobile mx-auto flex w-full max-w-[var(--container-desktop)] flex-col gap-40 pt-24 pb-80 md:px-72 xl:flex-row xl:items-start xl:justify-between xl:gap-0 xl:px-0 xl:pt-0 xl:pb-[165px]">
        <section
          className="flex w-full flex-col gap-24 md:gap-32 xl:w-[820px] xl:gap-[37px]"
          aria-label="기사님 목록"
        >
          <MoversFilters filters={filters} />
          <MoversList filters={filters} initialMovers={initialMovers} />
        </section>

        <FavoriteMoversSidebar />
      </div>
    </div>
  );
}
