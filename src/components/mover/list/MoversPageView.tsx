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
      <div className="hidden lg:block">
        <PageHeader title="기사님 찾기" />
      </div>

      <div className="px-margin-mobile mx-auto flex w-full max-w-[var(--container-desktop)] flex-col gap-40 pt-24 pb-80 min-[744px]:px-72 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:px-0 lg:pt-0 lg:pb-[165px]">
        <section
          className="flex w-full flex-col gap-24 min-[744px]:gap-32 lg:w-[820px] lg:gap-[37px]"
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
