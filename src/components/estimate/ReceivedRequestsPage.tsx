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
import { Text } from "@/components/common/Text";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";
import Toast from "@/components/common/Toast/Toast";
import { getMoverEstimateRequests } from "@/lib/api/moverEstimateRequests";
import {
  useMoverEstimateRequests,
  useRejectMoverEstimate,
  useSendMoverEstimate,
} from "@/hooks/useMoverEstimateRequests";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { MoveType } from "@/types/move";
import type { MoverEstimateRequest, RequestSort } from "@/types/moverEstimateRequest";

import ReceivedRequestCard from "./ReceivedRequestCard";
import ReceivedRequestsSkeleton from "./ReceivedRequestsSkeleton";
import RejectEstimateModal from "./RejectEstimateModal";
import SendEstimateModal, { type SendEstimateInput } from "./SendEstimateModal";

export default function ReceivedRequestsPage() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [moveTypes, setMoveTypes] = useState<MoveType[]>([]);
  const [includeDesignated, setIncludeDesignated] = useState(false);
  const [serviceAreaOnly, setServiceAreaOnly] = useState(false);
  const [sort, setSort] = useState<RequestSort>("requestedAt");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MoverEstimateRequest | null>(null);
  const [requestToReject, setRequestToReject] = useState<MoverEstimateRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const requestQuery = {
    keyword: keyword || undefined,
    moveType: moveTypes.length ? moveTypes : undefined,
    isDesignated: includeDesignated ? true : undefined,
    isServiceArea: serviceAreaOnly ? true : undefined,
    sort,
    limit: 10,
  };
  const query = useMoverEstimateRequests(requestQuery);
  const sendEstimateMutation = useSendMoverEstimate();
  const rejectEstimateMutation = useRejectMoverEstimate();

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
    const nextQuery = { ...requestQuery, ...patch };

    void queryClient.prefetchInfiniteQuery({
      queryKey: [...QUERY_KEYS.ESTIMATES.ALL, nextQuery],
      queryFn: ({ pageParam }) =>
        getMoverEstimateRequests({ ...nextQuery, cursor: pageParam as string | undefined }),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage: Awaited<ReturnType<typeof getMoverEstimateRequests>>) =>
        lastPage.pagination.nextCursor ?? undefined,
    });
  }

  function getNextMoveTypes(moveType: MoveType) {
    return moveTypes.includes(moveType)
      ? moveTypes.filter((item) => item !== moveType)
      : [...moveTypes, moveType];
  }

  function handleSendEstimate(input: SendEstimateInput) {
    if (!selectedRequest) return;

    sendEstimateMutation.mutate(
      {
        estimateRequestId: selectedRequest.id,
        input,
      },
      {
        onSuccess: () => {
          setSelectedRequest(null);
          setToastMessage("견적을 보냈습니다.");
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : "견적 전송에 실패했습니다.");
        },
      },
    );
  }

  function handleRejectEstimate(reason: string) {
    if (!requestToReject) return;

    rejectEstimateMutation.mutate(
      {
        estimateRequestId: requestToReject.id,
        input: { reason },
      },
      {
        onSuccess: () => {
          setRequestToReject(null);
          setToastMessage("요청을 반려했습니다.");
        },
        onError: (error) => {
          setToastMessage(error instanceof Error ? error.message : "요청 반려에 실패했습니다.");
        },
      },
    );
  }

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = query.data?.pages[0]?.pagination.totalCount ?? 0;

  return (
    <>
      <PageHeader title="받은 요청" />

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 md:px-[72px] xl:gap-40 xl:px-0">
        <section className="flex flex-col gap-24">
          <form onSubmit={submitSearch} className="mx-10 w-[calc(100%_-_20px)] xl:mx-0 xl:w-full">
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

          <div className="hidden flex-wrap gap-12 xl:flex">
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
        </section>

        <section className="flex flex-col gap-12 xl:gap-24">
          {query.isPending ? (
            <Skeleton className="hidden h-26 w-72 xl:block" />
          ) : (
            <Text as="p" variant="2lg-semibold" className="text-text-secondary hidden xl:block">
              전체 {totalCount}건
            </Text>
          )}
          <div className="flex min-h-40 flex-wrap items-center justify-between gap-12 px-10 xl:px-0">
            {query.isPending ? (
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
                  prefetchRequests({ isDesignated: includeDesignated ? undefined : true })
                }
                label="지정 견적 요청"
              />
              <Checkbox
                checked={serviceAreaOnly}
                onCheckedChange={setServiceAreaOnly}
                onPrefetch={() =>
                  prefetchRequests({ isServiceArea: serviceAreaOnly ? undefined : true })
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

          {query.isPending ? <ReceivedRequestsSkeleton /> : null}
          {query.isError && (
            <Text as="p" variant="lg-regular" className="text-text-error py-80 text-center">
              받은 요청을 불러오지 못했어요.
            </Text>
          )}
          {!query.isPending && !query.isError && items.length === 0 && (
            <div className="flex flex-col items-center gap-32 py-[96px]">
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
              <div className="grid w-full grid-cols-1 gap-24 md:max-w-[588px] xl:max-w-none xl:grid-cols-2">
                {items.map((request) => (
                  <ReceivedRequestCard
                    key={request.id}
                    request={request}
                    onSendEstimate={setSelectedRequest}
                    onRejectEstimate={setRequestToReject}
                  />
                ))}
              </div>
              {query.hasNextPage && (
                <button
                  type="button"
                  disabled={query.isFetchingNextPage}
                  onClick={() => query.fetchNextPage()}
                  className="border-border-brand text-text-brand disabled:text-text-disabled disabled:border-border-disabled mx-auto h-[54px] w-full max-w-[327px] rounded-xl border font-semibold disabled:cursor-not-allowed"
                >
                  {query.isFetchingNextPage ? "불러오는 중..." : "더 보기"}
                </button>
              )}
            </>
          )}
        </section>
      </main>

      {isFilterOpen ? (
        <Modal
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
      ) : null}

      {selectedRequest && (
        <SendEstimateModal
          request={selectedRequest}
          isPending={sendEstimateMutation.isPending}
          onSubmit={handleSendEstimate}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {requestToReject && (
        <RejectEstimateModal
          request={requestToReject}
          isPending={rejectEstimateMutation.isPending}
          onSubmit={handleRejectEstimate}
          onClose={() => setRequestToReject(null)}
        />
      )}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
