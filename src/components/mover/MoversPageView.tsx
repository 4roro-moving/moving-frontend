import { PageHeader } from "@/components/common/PageHeader";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MoversFilters } from "@/components/mover/MoversFilters";
import { MoversList } from "@/components/mover/MoversList";
import { MOCK_FAVORITE_MOVERS } from "@/components/mover/constants";
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

        <aside className="hidden w-full flex-col gap-16 lg:flex lg:w-[327px] lg:shrink-0 lg:self-stretch lg:pt-[192px]">
          <Text as="h2" variant="xl-semibold" className="text-text-secondary">
            찜한 기사님
          </Text>
          <ul className="flex flex-col gap-16">
            {MOCK_FAVORITE_MOVERS.map((mover) => (
              <li key={mover.id}>
                <MoverCard mover={mover} variant="compact" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
