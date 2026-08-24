"use client";

import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent, useState } from "react";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import SelectableChip from "@/components/common/Chip/SelectableChip";
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

  return (
    <>
      <PageHeader title="받은 요청" />

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
              placeholder="어떤 고객님을 찾고 계세요?"
              aria-label="고객명 검색"
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
                    {moveType.label}
                  </SelectableChip>
                );
              })}
            </div>
            <Text as="p" variant="md-regular" className="text-text-muted mt-4">
              기사님이 제공하는 서비스 유형의 견적 요청만 확인할 수 있어요.
            </Text>
          </div>
        </section>

        <section className="flex flex-col gap-12 xl:gap-24">
          {isInitialLoading ? (
            <Skeleton className="hidden h-26 w-72 xl:block" />
          ) : (
            <Text as="p" variant="2lg-semibold" className="text-text-secondary hidden xl:block">
              전체 {totalCount}건
            </Text>
          )}

          <div className="flex min-h-40 flex-wrap items-center justify-between gap-12 px-10 xl:px-0">
            {isInitialLoading ? (
              <Skeleton className="h-20 w-64 xl:hidden" />
            ) : (
              <Text as="p" variant="md-semibold" className="text-text-secondary xl:hidden">
                전체 {totalCount}건
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
                label="지정 견적 요청"
              />

              <Checkbox
                checked={serviceAreaOnly}
                onCheckedChange={setServiceAreaOnly}
                onPrefetch={() =>
                  prefetchRequests({
                    isServiceArea: serviceAreaOnly ? undefined : true,
                  })
                }
                label="서비스 가능 지역"
              />
            </div>

            <div className="flex items-center gap-4">
              <Select
                desc="정렬"
                label="요청 정렬"
                variant="sort"
                size="lg"
                defaultValue={sort}
                onChange={(value) => setSort(value as RequestSort)}
              >
                <Select.Option
                  value="requestedAt"
                  onPrefetch={() => prefetchRequests({ sort: "requestedAt" })}
                >
                  요청일 빠른순
                </Select.Option>
                <Select.Option
                  value="moveDate"
                  onPrefetch={() => prefetchRequests({ sort: "moveDate" })}
                >
                  이사 빠른순
                </Select.Option>
              </Select>

              <button
                type="button"
                aria-label="필터 열기"
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
              받은 요청을 불러오지 못했어요.
            </Text>
          )}

          {!isInitialLoading && !query.isError && items.length === 0 && (
            <div className="py-page-header-height-desktop flex flex-col items-center gap-32">
              <Image
                className="opacity-50"
                src="/images/empty-received-requests.png"
                alt=""
                width={240}
                height={196}
              />
              <Text as="p" variant="xl-regular" className="text-text-subtle">
                아직 받은 요청이 없어요!
              </Text>
            </div>
          )}

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
                    받은 요청 목록을 불러오는 중이에요
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
                  disabled={query.isFetchingNextPage}
                  onClick={() => query.fetchNextPage()}
                  className="border-border-brand text-text-brand disabled:text-text-disabled disabled:border-border-disabled mx-auto h-54 w-full max-w-[327px] rounded-xl border font-semibold disabled:cursor-not-allowed"
                >
                  {query.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
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
            <Modal.Title variant="2lg-bold">필터</Modal.Title>
            <Modal.Close size="sm" onClose={() => setIsFilterOpen(false)} />
          </div>

          <section className="flex flex-col gap-8">
            <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
              이사 유형
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
                    {moveType.label}
                  </SelectableChip>
                );
              })}
            </div>
            <Text as="p" variant="xs-regular" className="text-text-muted mt-4">
              기사님이 제공하는 서비스 유형의 견적 요청만 확인할 수 있어요.
            </Text>
          </section>

          <section className="flex flex-col gap-8">
            <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
              지역 및 견적
            </Text>

            <div className="flex flex-col gap-12">
              {[
                {
                  label: "지정 견적 요청",
                  checked: includeDesignated,
                  onChange: setIncludeDesignated,
                },
                {
                  label: "서비스 가능 지역",
                  checked: serviceAreaOnly,
                  onChange: setServiceAreaOnly,
                },
              ].map((filter) => (
                <Checkbox
                  key={filter.label}
                  checked={filter.checked}
                  onCheckedChange={filter.onChange}
                  onPrefetch={() => {
                    if (filter.label === "지정 견적 요청") {
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
          조회하기
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
