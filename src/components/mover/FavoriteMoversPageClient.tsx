"use client";

import { useState } from "react";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import Button from "@/components/common/Button/Button";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import FavoriteMoversDeleteConfirmModal from "@/components/mover/FavoriteMoversDeleteConfirmModal";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useBulkRemoveFavoriteMovers } from "@/hooks/useFavoriteMover";
import { useFavoriteMoversInfinite } from "@/hooks/useFavoriteMovers";
import { fetchAllFavoriteMoverIds } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { mapMoverListItemToMover } from "@/lib/utils/mapMover";

const EMPTY_DESCRIPTION = (
  <>
    아직 찜한 기사님이 없어요.
    <br />
    기사님 찾기에서 마음에 드는 기사님을 찜해보세요.
  </>
);

const LIST_SKELETON_COUNT = 3;

const CONTENT_CLASSNAME =
  "px-margin-mobile mx-auto flex w-full max-w-[var(--container-desktop)] flex-col pt-22 pb-80 min-[744px]:px-72 min-[744px]:pt-30 lg:px-0 lg:pt-32 lg:pb-[165px]";

interface FavoriteMoversToolbarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  disabled?: boolean;
  isDeleting?: boolean;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
}

function FavoriteMoversToolbar({
  selectedCount,
  totalCount,
  isAllSelected,
  disabled = false,
  isDeleting = false,
  onSelectAll,
  onBulkDelete,
}: FavoriteMoversToolbarProps) {
  const canDelete = selectedCount > 0 && !disabled && !isDeleting;

  return (
    <div className="flex h-36 w-full items-center justify-between gap-12">
      <Checkbox
        checked={isAllSelected}
        disabled={disabled || totalCount === 0}
        onCheckedChange={onSelectAll}
        label={
          <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }}>
            {`전체선택(${selectedCount}/${totalCount})`}
          </Text>
        }
        labelClassName="text-text-tertiary"
      />

      <button
        type="button"
        disabled={!canDelete}
        className={cn(
          "rounded-8 focus-visible:ring-border-brand px-8 transition-colors focus-visible:ring-2 focus-visible:outline-none min-[744px]:px-12",
          canDelete
            ? "text-text-subtle hover:text-text-secondary"
            : "text-text-subtle cursor-not-allowed opacity-50",
        )}
        onClick={onBulkDelete}
      >
        <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }} className="text-inherit">
          선택 항목 삭제
        </Text>
      </button>
    </div>
  );
}

function FavoriteMoversLoadingSkeleton() {
  return (
    <div
      className="flex flex-col gap-10 min-[744px]:gap-18 lg:gap-28"
      aria-busy="true"
      aria-label="찜한 기사님을 불러오는 중"
    >
      <FavoriteMoversToolbar
        selectedCount={0}
        totalCount={0}
        isAllSelected={false}
        disabled
        onSelectAll={() => undefined}
        onBulkDelete={() => undefined}
      />
      <MoverCardSkeletonList
        variant="full"
        count={LIST_SKELETON_COUNT}
        showSelection
        className="gap-20 min-[744px]:gap-24 lg:gap-20"
        label="찜한 기사님을 불러오는 중"
      />
    </div>
  );
}

function FavoriteMoversContent() {
  const { canFetch } = useCustomerAuthReady();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** 화면에 안 보이는 찜까지 포함해 전체를 고른 상태 (카드는 더보기로만 표시) */
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isResolvingAllIds, setIsResolvingAllIds] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const query = useFavoriteMoversInfinite({ enabled: canFetch });
  const bulkRemoveMutation = useBulkRemoveFavoriteMovers({ onError: setToastMessage });

  const movers = query.data?.pages.flatMap((page) => page.data.map(mapMoverListItemToMover)) ?? [];
  const totalCount = query.data?.pages[0]?.pagination.totalCount ?? 0;
  const loadedIds = movers.map((mover) => mover.id);
  const selectedOnLoadedCount = loadedIds.filter((id) => selectedIds.includes(id)).length;
  const selectedCount = isSelectAll ? totalCount : selectedOnLoadedCount;
  const isAllSelected = isSelectAll || (totalCount > 0 && selectedCount === totalCount);
  const hasSelection = selectedCount > 0;
  const isBulkDeleting = bulkRemoveMutation.isPending || isResolvingAllIds;

  const showEmpty =
    !query.isError && !query.isPending && !query.isFetching && !isBulkDeleting && totalCount === 0;
  const showListSkeleton =
    !query.isError &&
    !showEmpty &&
    (query.isPending ||
      (movers.length === 0 && (totalCount > 0 || isBulkDeleting || query.isFetching)));
  const showList = !query.isError && !showEmpty && !showListSkeleton && movers.length > 0;

  const clearSelection = () => {
    setSelectedIds([]);
    setIsSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setIsSelectAll(true);
      setSelectedIds(loadedIds);
      return;
    }
    clearSelection();
  };

  const handleToggleMover = (moverId: string, checked: boolean) => {
    if (isSelectAll) {
      if (checked) {
        return;
      }
      // 전체선택 중 하나만 해제 → 현재 불러온 목록 기준으로 부분 선택
      setIsSelectAll(false);
      setSelectedIds(loadedIds.filter((id) => id !== moverId));
      return;
    }

    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(moverId) ? prev : [...prev, moverId];
      }
      return prev.filter((id) => id !== moverId);
    });
  };

  const removeFavorites = async (idsToRemove: string[]) => {
    if (idsToRemove.length === 0) {
      return;
    }

    await bulkRemoveMutation.mutateAsync(idsToRemove);
    clearSelection();
  };

  const handleBulkDelete = () => {
    if (!hasSelection || isBulkDeleting) {
      return;
    }

    if (isSelectAll || selectedCount === totalCount) {
      setIsDeleteConfirmOpen(true);
      return;
    }

    void (async () => {
      try {
        await removeFavorites([...selectedIds]);
      } catch (error) {
        setToastMessage(
          getApiErrorMessage(
            error,
            "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
          ),
        );
      }
    })();
  };

  const handleConfirmDeleteAll = () => {
    void (async () => {
      setIsResolvingAllIds(true);
      try {
        const allIds = await fetchAllFavoriteMoverIds();
        await removeFavorites(allIds);
        setIsDeleteConfirmOpen(false);
      } catch (error) {
        setToastMessage(
          getApiErrorMessage(
            error,
            "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
          ),
        );
      } finally {
        setIsResolvingAllIds(false);
      }
    })();
  };

  const handleLoadMore = () => {
    if (!query.hasNextPage || query.isFetchingNextPage) {
      return;
    }
    void query.fetchNextPage();
  };

  return (
    <div className={CONTENT_CLASSNAME}>
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
          aria-busy={query.isFetching || isBulkDeleting}
        >
          <FavoriteMoversToolbar
            selectedCount={selectedCount}
            totalCount={totalCount}
            isAllSelected={isAllSelected}
            isDeleting={isBulkDeleting}
            onSelectAll={handleSelectAll}
            onBulkDelete={handleBulkDelete}
          />

          <ul className="flex flex-col gap-20 min-[744px]:gap-24 lg:gap-20">
            {movers.map((mover) => (
              <li key={mover.id}>
                <MoverCard
                  mover={mover}
                  variant="full"
                  onFavoriteError={setToastMessage}
                  selection={{
                    checked: isSelectAll || selectedIds.includes(mover.id),
                    onCheckedChange: (checked) => handleToggleMover(mover.id, checked),
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
        open={isDeleteConfirmOpen}
        count={totalCount}
        isPending={isBulkDeleting}
        onClose={() => {
          if (!isBulkDeleting) {
            setIsDeleteConfirmOpen(false);
          }
        }}
        onConfirm={handleConfirmDeleteAll}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
}

export default function FavoriteMoversPageClient() {
  return (
    <div className="bg-background-subtle flex w-full flex-col">
      <PageHeader title="찜한 기사님" />
      <CustomerAuthGate
        loadingFallback={
          <div className={CONTENT_CLASSNAME}>
            <FavoriteMoversLoadingSkeleton />
          </div>
        }
      >
        <FavoriteMoversContent />
      </CustomerAuthGate>
    </div>
  );
}
