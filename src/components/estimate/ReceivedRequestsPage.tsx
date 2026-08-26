"use client";

import { useTranslations } from "next-intl";

import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import SelectableChip from "@/components/common/Chip/SelectableChip";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Modal from "@/components/common/Modal/Modal";
import { PageHeader } from "@/components/common/PageHeader";
import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useMoverEstimateRequests } from "@/hooks/useMoverEstimateRequests";
import { useReceivedRequestActions } from "@/hooks/useReceivedRequestActions";
import { useListLoadingState } from "@/hooks/queries/useListLoadingState";
import { PREVIOUS_DATA_LOADING_CLASS_NAME } from "@/lib/constants/loading";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { getMoverEstimateRequestsInfiniteQueryOptions } from "@/lib/queryOptions/moverEstimateRequests";
import type { MoveType } from "@/types/move";
import type { RequestSort } from "@/types/moverEstimateRequest";
import { cn } from "@/lib/utils/cn";

import ReceivedRequestCard from "./ReceivedRequestCard";
import ReceivedRequestsSkeleton from "./ReceivedRequestsSkeleton";
import RejectEstimateModal from "./RejectEstimateModal";
import SendEstimateModal from "./SendEstimateModal";

export default function ReceivedRequestsPage() {
  const tr = useTranslations("estimates");
  const tm = useTranslations("moverSearch");
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [moveTypes, setMoveTypes] = useState<MoveType[]>([]);
  const [includeDesignated, setIncludeDesignated] = useState(false);
  const [serviceAreaOnly, setServiceAreaOnly] = useState(false);
  const [sort, setSort] = useState<RequestSort>("requestedAt");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const requestQuery = {
    keyword: keyword || undefined,
    moveType: moveTypes.length ? moveTypes : undefined,
    isDesignated: includeDesignated ? true : undefined,
    isServiceArea: serviceAreaOnly ? true : undefined,
    sort,
    limit: 10,
  };

  const query = useMoverEstimateRequests(requestQuery);
  const requestActions = useReceivedRequestActions();

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setKeyword(searchText.trim());
  }

  function toggleMoveType(moveType: MoveType) {
    if (moveTypes.includes(moveType)) {
      setMoveTypes(moveTypes.filter((item) => item !== moveType));
    } else {
      setMoveTypes([...moveTypes, moveType]);
    }
  }

  function prefetchRequests(patch: Partial<typeof requestQuery>) {
    const nextQuery = {
      ...requestQuery,
      ...patch,
    };

    void queryClient.prefetchInfiniteQuery(getMoverEstimateRequestsInfiniteQueryOptions(nextQuery));
  }

  function getNextMoveTypes(moveType: MoveType) {
    return moveTypes.includes(moveType)
      ? moveTypes.filter((item) => item !== moveType)
      : [...moveTypes, moveType];
  }

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = query.data?.pages[0]?.pagination.totalCount ?? 0;
  const { isInitialLoading, isPreviousDataLoading } = useListLoadingState(query);
  const hasActiveFilters =
    keyword.length > 0 || moveTypes.length > 0 || includeDesignated || serviceAreaOnly;
  const shouldShowEmpty =
    !isInitialLoading && !isPreviousDataLoading && !query.isError && items.length === 0;
  const shouldShowEmptyLoading =
    !isInitialLoading && isPreviousDataLoading && !query.isError && items.length === 0;

  return (
    <>
      <PageHeader title={tr("mover.receivedTitle")} />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 md:px-72 xl:gap-40 xl:px-0">
        <section className="flex flex-col gap-24">
          <form onSubmit={submitSearch} className="mx-10 w-[calc(100%-20px)] xl:mx-0 xl:w-full">
            <Search
              size="responsive"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              onClear={() => {
                setSearchText("");
                setKeyword("");
              }}
              className="w-full"
              placeholder={tr("mover.searchPlaceholder")}
              aria-label={tr("mover.searchAria")}
            />
          </form>

          <div className="hidden flex-col gap-8 xl:flex">
            <div className="flex flex-wrap gap-12">
              {MOVE_TYPE_OPTIONS.map((moveType) => {
                const isSelected = moveTypes.includes(moveType.value);

                return (
                  <SelectableChip
                    key={moveType.value}
                    size="md"
                    selected={isSelected}
                    onClick={() => toggleMoveType(moveType.value)}
                    onPrefetch={() => {
                      const nextMoveTypes = getNextMoveTypes(moveType.value);
                      prefetchRequests({
                        moveType: nextMoveTypes.length ? nextMoveTypes : undefined,
                      });
                    }}
                  >
                    {tm(`moveTypes.${moveType.value}`)}
                  </SelectableChip>
                );
              })}
            </div>
            <Text as="p" variant="md-regular" className="text-text-muted mt-4">
              {tr("mover.serviceTypeHint")}
            </Text>
          </div>
        </section>

        <section className="flex flex-col gap-12 xl:gap-24">
          {isInitialLoading ? (
            <Skeleton className="hidden h-26 w-72 xl:block" />
          ) : (
            <Text as="p" variant="2lg-semibold" className="text-text-secondary hidden xl:block">
              {tr("mover.totalCount", { count: totalCount })}
            </Text>
          )}

          <div className="flex min-h-40 flex-wrap items-center justify-between gap-12 px-10 xl:px-0">
            {isInitialLoading ? (
              <Skeleton className="h-20 w-64 xl:hidden" />
            ) : (
              <Text as="p" variant="md-semibold" className="text-text-secondary xl:hidden">
                {tr("mover.totalCount", { count: totalCount })}
              </Text>
            )}

            <div className="hidden flex-wrap items-center gap-12 text-base xl:flex">
              <Checkbox
                checked={includeDesignated}
                onCheckedChange={setIncludeDesignated}
                onPrefetch={() =>
                  prefetchRequests({
                    isDesignated: includeDesignated ? undefined : true,
                  })
                }
                label={tr("mover.designated")}
              />

              <Checkbox
                checked={serviceAreaOnly}
                onCheckedChange={setServiceAreaOnly}
                onPrefetch={() =>
                  prefetchRequests({
                    isServiceArea: serviceAreaOnly ? undefined : true,
                  })
                }
                label={tr("mover.serviceAreaOnly")}
              />
            </div>

            <div className="flex items-center gap-4">
              <Select
                desc={tr("mover.sort")}
                label={tr("mover.sortAria")}
                variant="sort"
                size="lg"
                defaultValue={sort}
                onChange={(value) => setSort(value as RequestSort)}
              >
                <Select.Option
                  value="requestedAt"
                  onPrefetch={() => prefetchRequests({ sort: "requestedAt" })}
                >
                  {tr("mover.sortRequestedAt")}
                </Select.Option>
                <Select.Option
                  value="moveDate"
                  onPrefetch={() => prefetchRequests({ sort: "moveDate" })}
                >
                  {tr("mover.sortMoveDate")}
                </Select.Option>
              </Select>

              <button
                type="button"
                aria-label={tr("mover.openFilter")}
                onClick={() => setIsFilterOpen(true)}
                className="border-filter-button-border flex h-32 w-32 items-center justify-center rounded-lg border xl:hidden"
              >
                <Image src="/icons/filter.svg" alt="" width={24} height={24} />
              </button>
            </div>
          </div>

          {isInitialLoading ? <ReceivedRequestsSkeleton /> : null}

          {query.isError && (
            <Text as="p" variant="lg-regular" className="text-text-error py-80 text-center">
              {tr("mover.receivedLoadFailed")}
            </Text>
          )}

          {shouldShowEmpty ? (
            <EmptyState
              size="sm"
              imageSrc="/images/empty-received-requests.png"
              description={
                hasActiveFilters ? (
                  <>
                    {tCommon("emptyState.noResultsTitle")}
                    <br />
                    {tCommon("emptyState.noResultsDescription")}
                  </>
                ) : (
                  tr("mover.receivedEmpty")
                )
              }
            />
          ) : null}

          {shouldShowEmptyLoading ? <ReceivedRequestsSkeleton /> : null}

          {items.length > 0 && (
            <>
              <div
                className={cn(
                  "grid w-full grid-cols-1 gap-24 md:max-w-147 xl:max-w-none xl:grid-cols-2",
                  isPreviousDataLoading && PREVIOUS_DATA_LOADING_CLASS_NAME,
                )}
                aria-busy={isPreviousDataLoading}
              >
                {isPreviousDataLoading ? (
                  <span className="sr-only" role="status">
                    {tr("mover.receivedLoading")}
                  </span>
                ) : null}
                {items.map((request) => (
                  <ReceivedRequestCard
                    key={request.id}
                    request={request}
                    onSendEstimate={requestActions.openSendModal}
                    onRejectEstimate={requestActions.openRejectModal}
                  />
                ))}
              </div>

              {query.hasNextPage && (
                <button
                  type="button"
                  disabled={query.isFetching}
                  onClick={() => query.fetchNextPage()}
                  className="border-border-brand text-text-brand disabled:text-text-disabled disabled:border-border-disabled mx-auto h-54 w-full max-w-[327px] rounded-xl border font-semibold disabled:cursor-not-allowed"
                >
                  {query.isFetching ? tr("mover.loadingMore") : tr("mover.loadMore")}
                </button>
              )}
            </>
          )}
        </section>
      </main>

      <Modal
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        presentation="responsive"
        size="md"
        overlayClassName="xl:hidden"
        className="items-stretch gap-32 px-24 py-32 text-left"
      >
        <div className="flex w-full flex-col gap-28">
          <div className="flex w-full shrink-0 items-center justify-between">
            <Modal.Title variant="2lg-bold">{tr("mover.filterTitle")}</Modal.Title>
            <Modal.Close size="sm" onClose={() => setIsFilterOpen(false)} />
          </div>

          <section className="flex flex-col gap-8">
            <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
              {tr("mover.moveType")}
            </Text>

            <div className="flex flex-wrap gap-12">
              {MOVE_TYPE_OPTIONS.map((moveType) => {
                const isSelected = moveTypes.includes(moveType.value);

                return (
                  <SelectableChip
                    key={moveType.value}
                    size="sm"
                    selected={isSelected}
                    onClick={() => toggleMoveType(moveType.value)}
                    onPrefetch={() => {
                      const nextMoveTypes = getNextMoveTypes(moveType.value);
                      prefetchRequests({
                        moveType: nextMoveTypes.length ? nextMoveTypes : undefined,
                      });
                    }}
                  >
                    {tm(`moveTypes.${moveType.value}`)}
                  </SelectableChip>
                );
              })}
            </div>
            <Text as="p" variant="xs-regular" className="text-text-muted mt-4">
              {tr("mover.serviceTypeHint")}
            </Text>
          </section>

          <section className="flex flex-col gap-8">
            <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
              {tr("mover.regionAndEstimate")}
            </Text>

            <div className="flex flex-col gap-12">
              {[
                {
                  id: "designated",
                  label: tr("mover.designated"),
                  checked: includeDesignated,
                  onChange: setIncludeDesignated,
                },
                {
                  id: "serviceArea",
                  label: tr("mover.serviceAreaOnly"),
                  checked: serviceAreaOnly,
                  onChange: setServiceAreaOnly,
                },
              ].map((filter) => (
                <Checkbox
                  key={filter.label}
                  checked={filter.checked}
                  onCheckedChange={filter.onChange}
                  onPrefetch={() => {
                    if (filter.id === "designated") {
                      prefetchRequests({
                        isDesignated: includeDesignated ? undefined : true,
                      });
                    } else {
                      prefetchRequests({
                        isServiceArea: serviceAreaOnly ? undefined : true,
                      });
                    }
                  }}
                  label={filter.label}
                  labelClassName="text-text-secondary"
                />
              ))}
            </div>
          </section>
        </div>

        <Modal.Button fullWidth size="cta" onClick={() => setIsFilterOpen(false)}>
          {tr("mover.applyFilters")}
        </Modal.Button>
      </Modal>

      {requestActions.selectedRequest ? (
        <SendEstimateModal
          open={requestActions.isSendOpen}
          request={requestActions.selectedRequest}
          isPending={requestActions.isSendingEstimate}
          onSubmit={requestActions.sendEstimate}
          onClose={requestActions.closeSendModal}
          onExitComplete={requestActions.clearSelectedRequest}
        />
      ) : null}

      {requestActions.requestToReject ? (
        <RejectEstimateModal
          open={requestActions.isRejectOpen}
          request={requestActions.requestToReject}
          isPending={requestActions.isRejectingEstimate}
          onSubmit={requestActions.rejectEstimate}
          onClose={requestActions.closeRejectModal}
          onExitComplete={requestActions.clearRequestToReject}
        />
      ) : null}

      {requestActions.toastMessage ? (
        <Toast onClose={requestActions.clearToast}>{requestActions.toastMessage}</Toast>
      ) : null}
    </>
  );
}
