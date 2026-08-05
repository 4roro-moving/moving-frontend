import { PageHeader } from "@/components/common/PageHeader";

import { FavoriteMoversSidebar } from "@/components/mover/favorites/FavoriteMoversSidebar";
import { MoversFilters } from "@/components/mover/list/MoversFilters";
import { MoversList } from "@/components/mover/list/MoversList";
import type { MoversSearchParamsState } from "@/lib/utils/moversSearchParams";

interface MoversPageViewProps {
  filters: MoversSearchParamsState;
}

export function MoversPageView({ filters }: MoversPageViewProps) {
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
          <MoversList filters={filters} />
        </section>

        <FavoriteMoversSidebar />
      </div>
    </div>
  );
}
