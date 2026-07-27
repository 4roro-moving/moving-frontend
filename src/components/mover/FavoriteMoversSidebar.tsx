"use client";

import { useState } from "react";

import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { useFavoriteMovers } from "@/hooks/useFavoriteMovers";
import { useIsClient } from "@/hooks/useIsClient";
import { hasAuthSession } from "@/lib/auth/session";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";

/** 사이드바 로딩 스켈레톤 카드 수 */
const FAVORITE_MOVERS_SKELETON_COUNT = 3;

export function FavoriteMoversSidebar() {
  // SSR/하이드레이션 전에는 토큰을 읽지 않아 서버·클라 HTML을 동일하게 맞춤
  const isClient = useIsClient();
  const isLoggedIn = isClient && hasAuthSession();
  const query = useFavoriteMovers({ enabled: isLoggedIn });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const movers = query.data?.data.map(mapMoverListItemToMover) ?? [];
  const showSkeleton = !isClient || (isLoggedIn && query.isPending);

  return (
    <aside className="hidden w-full flex-col gap-16 lg:flex lg:w-[327px] lg:shrink-0 lg:self-stretch lg:pt-[192px]">
      <Text as="h2" variant="xl-semibold" className="text-text-secondary">
        찜한 기사님
      </Text>

      {showSkeleton ? (
        <MoverCardSkeletonList
          variant="compact"
          count={FAVORITE_MOVERS_SKELETON_COUNT}
          label="찜한 기사님을 불러오는 중"
        />
      ) : !isLoggedIn ? (
        <Text as="p" variant="md-regular" className="text-text-muted">
          로그인 후 찜한 기사님을 확인할 수 있습니다.
        </Text>
      ) : query.isError ? (
        <Text as="p" variant="md-regular" className="text-text-muted">
          찜한 기사님을 불러오지 못했습니다.
        </Text>
      ) : movers.length === 0 ? (
        <Text as="p" variant="md-regular" className="text-text-muted">
          찜한 기사님이 없습니다.
        </Text>
      ) : (
        <ul className="flex flex-col gap-16">
          {movers.map((mover) => (
            <li key={mover.id}>
              <MoverCard mover={mover} variant="compact" onFavoriteError={setToastMessage} />
            </li>
          ))}
        </ul>
      )}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </aside>
  );
}
