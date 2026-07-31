"use client";

import { useState } from "react";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import MoversErrorPanel from "@/components/mover/MoversErrorPanel";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { useBulkRemoveFavoriteMovers } from "@/hooks/useFavoriteMover";
import { useFavoriteMovers } from "@/hooks/useFavoriteMovers";
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
  const hasSelection = selectedCount > 0;
  const canDelete = hasSelection && !disabled && !isDeleting;

  return (
    <div className="flex h-36 w-full items-center justify-between">
      <Checkbox
        checked={isAllSelected}
        disabled={disabled || totalCount === 0}
        onCheckedChange={onSelectAll}
        label={
          <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }}>
            {`전체 선택(${selectedCount}/${totalCount})`}
          </Text>
        }
        labelClassName="text-text-tertiary"
      />

      <button
        type="button"
        disabled={!canDelete}
        className={cn(
          "rounded-8 focus-visible:ring-border-brand px-12 transition-colors focus-visible:ring-2 focus-visible:outline-none",
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
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const query = useFavoriteMovers({ page, enabled: canFetch });
  const bulkRemoveMutation = useBulkRemoveFavoriteMovers({ onError: setToastMessage });

  const movers = query.data?.data.map(mapMoverListItemToMover) ?? [];
  const totalPages = Math.max(1, query.data?.pagination.totalPages ?? 1);
  const pageIds = movers.map((mover) => mover.id);
  const selectedOnPageCount = pageIds.filter((id) => selectedIds.includes(id)).length;
  const isAllSelected = pageIds.length > 0 && selectedOnPageCount === pageIds.length;
  const hasSelection = selectedIds.length > 0;
  const isBulkDeleting = bulkRemoveMutation.isPending;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
      return;
    }

    setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
  };

  const handleToggleMover = (moverId: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(moverId) ? prev : [...prev, moverId];
      }
      return prev.filter((id) => id !== moverId);
    });
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    setSelectedIds([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBulkDelete = async () => {
    if (!hasSelection || isBulkDeleting) return;

    const idsToRemove = [...selectedIds];
    const removedAllOnPage = selectedOnPageCount === pageIds.length;

    try {
      await bulkRemoveMutation.mutateAsync(idsToRemove);
      setSelectedIds([]);
      if (removedAllOnPage && page > 1) {
        setPage((prev) => prev - 1);
      }
    } catch (error) {
      setToastMessage(
        getApiErrorMessage(
          error,
          "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.",
        ),
      );
    }
  };

  return (
    <div className={CONTENT_CLASSNAME}>
      {query.isPending ? <FavoriteMoversLoadingSkeleton /> : null}

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

      {!query.isPending && !query.isError && movers.length === 0 ? (
        <EmptyState
          size="sm"
          imageSrc="/images/empty/character.png"
          description={EMPTY_DESCRIPTION}
          buttonLabel="기사님 찾기"
          href={APP_ROUTES.MOVERS.ROOT}
        />
      ) : null}

      {!query.isPending && !query.isError && movers.length > 0 ? (
        <div
          className="flex w-full flex-col gap-10 min-[744px]:gap-18 lg:gap-28"
          aria-busy={query.isFetching || isBulkDeleting}
        >
          <FavoriteMoversToolbar
            selectedCount={selectedOnPageCount}
            totalCount={pageIds.length}
            isAllSelected={isAllSelected}
            isDeleting={isBulkDeleting}
            onSelectAll={handleSelectAll}
            onBulkDelete={() => {
              void handleBulkDelete();
            }}
          />

          <ul className="flex flex-col gap-20 min-[744px]:gap-24 lg:gap-20">
            {movers.map((mover) => (
              <li key={mover.id}>
                <MoverCard
                  mover={mover}
                  variant="full"
                  onFavoriteError={setToastMessage}
                  selection={{
                    checked: selectedIds.includes(mover.id),
                    onCheckedChange: (checked) => handleToggleMover(mover.id, checked),
                  }}
                />
              </li>
            ))}
          </ul>

          {totalPages > 1 ? (
            <div className="pt-16 md:pt-24">
              <Pagination
                currentPage={page}
                pageCount={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          ) : null}
        </div>
      ) : null}

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
