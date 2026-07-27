import MoverCard from "@/components/mover/MoverCard";
import { Text } from "@/components/common/Text";
import { MOCK_MOVERS } from "@/components/mover/constants";
import { filterMockMovers } from "@/lib/movers/filterMockMovers";
import type { MoversSearchParamsState } from "@/lib/movers/searchParams";

interface MoversListProps {
  filters: MoversSearchParamsState;
}

/** NOTE: API·무한스크롤 연동 전이므로, URL 필터 기준 mock 목록 */
export function MoversList({ filters }: MoversListProps) {
  const movers = filterMockMovers(MOCK_MOVERS, filters);

  if (movers.length === 0) {
    return (
      <Text as="p" variant="lg-medium" className="text-text-muted py-40 text-center">
        조건에 맞는 기사님이 없습니다.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-20">
      {movers.map((mover) => (
        <li key={mover.id}>
          <MoverCard mover={mover} variant="full" />
        </li>
      ))}
    </ul>
  );
}
