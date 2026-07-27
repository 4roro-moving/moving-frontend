"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { useFavoriteMovers } from "@/hooks/useFavoriteMovers";
import { useIsClient } from "@/hooks/useIsClient";
import { FAVORITE_MOVERS_SIDEBAR_LIMIT } from "@/lib/api/favorites";
import { getLoginRedirectPath, hasAuthSession } from "@/lib/auth/session";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";
import { cn } from "@/lib/utils/cn";

/** 사이드바 로딩 스켈레톤 카드 수 (표시 한도와 동일) */
const FAVORITE_MOVERS_SKELETON_COUNT = FAVORITE_MOVERS_SIDEBAR_LIMIT;

const SIDEBAR_PANEL_CLASS_NAME = cn(
  "border-border-subtle bg-background-surface rounded-16 flex w-full flex-col items-center gap-16 border-[0.5px] px-20 py-24",
  "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
);

interface FavoriteMoversSidebarStatusProps {
  title: string;
  description: ReactNode;
  action?:
    | { type: "link"; label: string; href: string }
    | { type: "button"; label: string; onClick: () => void; disabled?: boolean };
}

function FavoriteMoversSidebarStatus({
  title,
  description,
  action,
}: FavoriteMoversSidebarStatusProps) {
  return (
    <div className={SIDEBAR_PANEL_CLASS_NAME}>
      <div className="flex w-full flex-col items-center gap-8 text-center">
        <Text as="p" variant="lg-semibold" className="text-text-secondary">
          {title}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          {description}
        </Text>
      </div>

      {action?.type === "link" ? (
        <Link
          href={action.href}
          className="bg-background-brand hover:bg-background-brand-hover rounded-12 flex h-54 w-full items-center justify-center px-16 transition-colors"
        >
          <Text as="span" variant="lg-semibold" className="text-text-inverse">
            {action.label}
          </Text>
        </Link>
      ) : null}

      {action?.type === "button" ? (
        <Button
          type="button"
          variant="outline"
          size="cta"
          fullWidth
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function FavoriteMoversSidebar() {
  // SSR/하이드레이션 전에는 토큰을 읽지 않아 서버·클라 HTML을 동일하게 맞춤
  const isClient = useIsClient();
  const isLoggedIn = isClient && hasAuthSession();
  const query = useFavoriteMovers({
    enabled: isLoggedIn,
    limit: FAVORITE_MOVERS_SIDEBAR_LIMIT,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const movers =
    query.data?.data.map(mapMoverListItemToMover).slice(0, FAVORITE_MOVERS_SIDEBAR_LIMIT) ?? [];
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
        <FavoriteMoversSidebarStatus
          title="아직 로그인하지 않았어요"
          description={
            <>
              로그인하면 찜한 기사님을
              <br />
              여기에서 바로 확인할 수 있어요.
            </>
          }
          action={{
            type: "link",
            label: "로그인하기",
            href: getLoginRedirectPath(),
          }}
        />
      ) : query.isError ? (
        <FavoriteMoversSidebarStatus
          title="불러오지 못했어요"
          description={
            <>
              찜한 기사님 목록을 가져오는 중
              <br />
              문제가 발생했습니다.
            </>
          }
          action={{
            type: "button",
            label: query.isFetching ? "다시 시도 중..." : "다시 시도",
            onClick: () => {
              void query.refetch();
            },
            disabled: query.isFetching,
          }}
        />
      ) : movers.length === 0 ? (
        <FavoriteMoversSidebarStatus
          title="찜한 기사님이 없어요"
          description={
            <>
              마음에 드는 기사님을 찜하면
              <br />
              여기에서 바로 모아볼 수 있어요.
            </>
          }
        />
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
