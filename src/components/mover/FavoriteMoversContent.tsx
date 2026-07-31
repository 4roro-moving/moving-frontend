"use client";

import Button from "@/components/common/Button/Button";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import FavoriteMoversDeleteConfirmModal from "@/components/mover/FavoriteMoversDeleteConfirmModal";
import FavoriteMoversLoadingSkeleton from "@/components/mover/FavoriteMoversLoadingSkeleton";
import FavoriteMoversToolbar from "@/components/mover/FavoriteMoversToolbar";
import MoverCard from "@/components/mover/MoverCard";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useFavoriteMoversInfinite } from "@/hooks/useFavoriteMovers";
import { useFavoriteMoversSelection } from "@/hooks/useFavoriteMoversSelection";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";

const EMPTY_DESCRIPTION = (
  <>
    아직 찜한 기사님이 없어요.
    <br />
    기사님 찾기에서 마음에 드는 기사님을 찜해보세요.
  </>
);

export const FAVORITE_MOVERS_CONTENT_CLASSNAME =
  "px-margin-mobile mx-auto flex w-full max-w-[var(--container-desktop)] flex-col pt-22 pb-80 min-[744px]:px-72 min-[744px]:pt-30 lg:px-0 lg:pt-32 lg:pb-[165px]";

export default function FavoriteMoversContent() {
  const { canFetch } = useCustomerAuthReady();
  const query = useFavoriteMoversInfinite({ enabled: canFetch });

  const movers = query.data?.pages.flatMap((page) => page.data.map(mapMoverListItemToMover)) ?? [];
  const totalCount = query.data?.pages[0]?.pagination.totalCount ?? 0;
  const loadedIds = movers.map((mover) => mover.id);

  const selection = useFavoriteMoversSelection({ loadedIds, totalCount });

  const showEmpty =
    !query.isError &&
    !query.isPending &&
    !query.isFetching &&
    !selection.isBulkDeleting &&
    totalCount === 0;
  const showListSkeleton =
    !query.isError &&
    !showEmpty &&
    (query.isPending ||
      (movers.length === 0 && (totalCount > 0 || selection.isBulkDeleting || query.isFetching)));
  const showList = !query.isError && !showEmpty && !showListSkeleton && movers.length > 0;

  const handleLoadMore = () => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }
    void query.fetchNextPage();
  };

  return (
    <div className={FAVORITE_MOVERS_CONTENT_CLASSNAME}>
      {showListSkeleton ? <FavoriteMoversLoadingSkeleton /> : null}

      {query.isError ? (
        <MoversErrorPanel
          title="불러오지 못했어요"
          description="찜한 기사님 목록을 가져오는 중 문제가 발생했습니다."
          actionLabel="다시 시도"
          isRetrying={query.isFetching}
          onRetry={() => {
            void query.refetch();
          }}
        />
      ) : null}

      {showEmpty ? (
        <EmptyState
          size="sm"
          imageSrc="/images/empty/character.png"
          description={EMPTY_DESCRIPTION}
          buttonLabel="기사님 찾기"
          href={APP_ROUTES.MOVERS.ROOT}
        />
      ) : null}

      {showList ? (
        <div
          className="flex w-full flex-col gap-10 min-[744px]:gap-18 lg:gap-28"
          aria-busy={query.isFetching || selection.isBulkDeleting}
        >
          <FavoriteMoversToolbar
            selectedCount={selection.selectedCount}
            totalCount={totalCount}
            isAllSelected={selection.isAllSelected}
            isDeleting={selection.isBulkDeleting}
            onSelectAll={selection.handleSelectAll}
            onBulkDelete={selection.handleBulkDelete}
          />

          <ul className="flex flex-col gap-20 min-[744px]:gap-24 lg:gap-20">
            {movers.map((mover) => (
              <li key={mover.id}>
                <MoverCard
                  mover={mover}
                  variant="full"
                  onFavoriteError={selection.setToastMessage}
                  selection={{
                    checked: selection.isMoverSelected(mover.id),
                    onCheckedChange: (checked) => selection.handleToggleMover(mover.id, checked),
                  }}
                />
              </li>
            ))}
          </ul>

          {query.hasNextPage ? (
            <div className="flex w-full justify-center pt-8 md:pt-16">
              <Button
                type="button"
                variant="outline"
                size="cta"
                fullWidth
                disabled={query.isFetchingNextPage}
                onClick={handleLoadMore}
                className="max-w-[327px]"
              >
                {query.isFetchingNextPage ? "불러오는 중..." : "더보기"}
              </Button>
            </div>
          ) : null}

          {query.isFetchNextPageError ? (
            <div className="flex w-full justify-center">
              <button
                type="button"
                className="text-text-brand focus-visible:ring-border-brand rounded-4 underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                onClick={handleLoadMore}
              >
                <Text as="span" variant="md-semibold" className="text-text-brand">
                  더 불러오지 못했어요. 다시 시도
                </Text>
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      <FavoriteMoversDeleteConfirmModal
        open={selection.isDeleteConfirmOpen}
        count={selection.deleteConfirmCount}
        isPending={selection.isBulkDeleting}
        onClose={selection.handleCloseDeleteConfirm}
        onConfirm={selection.handleConfirmDeleteAll}
      />

      {selection.toastMessage ? (
        <Toast onClose={() => selection.setToastMessage(null)}>{selection.toastMessage}</Toast>
      ) : null}
    </div>
  );
}
