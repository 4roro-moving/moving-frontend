"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import Modal from "@/components/common/Modal/Modal";
import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import {
  useMoverEstimateRequests,
  useRejectMoverEstimate,
  useSendMoverEstimate,
} from "@/hooks/useMoverEstimateRequests";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import type { MoveType } from "@/types/move";
import type { MoverEstimateRequest, RequestSort } from "@/types/moverEstimateRequest";

import ReceivedRequestCard from "./ReceivedRequestCard";
import RejectEstimateModal from "./RejectEstimateModal";
import SendEstimateModal, { type SendEstimateInput } from "./SendEstimateModal";

export default function ReceivedRequestsPage() {
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

  const query = useMoverEstimateRequests({
    keyword: keyword || undefined,
    moveType: moveTypes.length ? moveTypes : undefined,
    isDesignated: includeDesignated ? true : undefined,
    isServiceArea: serviceAreaOnly ? true : undefined,
    sort,
    limit: 10,
  });
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
      <div className="border-border-subtle border-b">
        <h1 className="text-text-primary mx-auto flex h-[54px] w-full max-w-[1200px] items-center px-24 text-lg font-semibold min-[744px]:px-[72px] lg:h-[96px] lg:px-0 lg:text-2xl">
          받은 요청
        </h1>
      </div>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 min-[744px]:px-[72px] lg:gap-40 lg:px-0">
        <section className="flex flex-col gap-24">
          <form onSubmit={submitSearch} className="mx-10 w-[calc(100%_-_20px)] lg:mx-0 lg:w-full">
            <Search
              size="md"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="h-[52px] w-full border-0 px-16 lg:h-64 lg:px-24"
              placeholder="어떤 고객님을 찾고 계세요?"
              aria-label="고객명 검색"
            />
          </form>

          <div className="hidden flex-wrap gap-12 lg:flex">
            {MOVE_TYPE_OPTIONS.map((moveType) => {
              const isSelected = moveTypes.includes(moveType.value);
              return (
                <button
                  key={moveType.value}
                  type="button"
                  onClick={() => toggleMoveType(moveType.value)}
                  className={`rounded-full border px-20 py-2.5 text-base lg:text-lg ${isSelected ? "border-border-brand bg-background-brand-muted text-text-brand font-medium" : "border-border-muted bg-background-subtle text-text-secondary font-normal"}`}
                >
                  {moveType.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-12 lg:gap-24">
          {!query.isPending && (
            <Text as="p" variant="2lg-semibold" className="text-text-secondary hidden lg:block">
              전체 {totalCount}건
            </Text>
          )}
          <div className="flex min-h-40 flex-wrap items-center justify-between gap-12 px-10 lg:px-0">
            {!query.isPending && (
              <Text as="p" variant="md-semibold" className="text-text-secondary lg:hidden">
                전체 {totalCount}건
              </Text>
            )}
            <div className="hidden flex-wrap items-center gap-12 text-base lg:flex">
              <label className="flex items-center gap-4">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={includeDesignated}
                  onChange={(event) => setIncludeDesignated(event.target.checked)}
                />
                <span className="peer-focus-visible:ring-border-brand flex h-36 w-36 items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded ${includeDesignated ? "bg-background-brand" : "border-border-muted bg-background-surface border"}`}
                  >
                    {includeDesignated && (
                      <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} />
                    )}
                  </span>
                </span>
                지정 견적 요청
              </label>
              <label className="flex items-center gap-4">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={serviceAreaOnly}
                  onChange={(event) => setServiceAreaOnly(event.target.checked)}
                />
                <span className="peer-focus-visible:ring-border-brand flex h-36 w-36 items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded ${serviceAreaOnly ? "bg-background-brand" : "border-border-muted bg-background-surface border"}`}
                  >
                    {serviceAreaOnly && (
                      <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} />
                    )}
                  </span>
                </span>
                서비스 가능 지역
              </label>
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
                <Select.Option value="requestedAt">요청일 빠른순</Select.Option>
                <Select.Option value="moveDate">이사 빠른순</Select.Option>
              </Select>
              <button
                type="button"
                aria-label="필터 열기"
                onClick={() => setIsFilterOpen(true)}
                className="border-filter-button-border flex h-32 w-32 items-center justify-center rounded-lg border lg:hidden"
              >
                <Image src="/icons/filter.svg" alt="" width={24} height={24} />
              </button>
            </div>
          </div>

          {query.isPending && (
            <Text as="p" variant="lg-regular" className="text-text-subtle py-80 text-center">
              받은 요청을 불러오는 중이에요.
            </Text>
          )}
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
              <div className="grid w-full grid-cols-1 gap-24 min-[744px]:max-w-[588px] lg:max-w-none lg:grid-cols-2">
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
          overlayClassName="lg:hidden"
          className="items-stretch gap-32 px-24 pt-24 pb-32 text-left"
        >
          <div className="flex w-full shrink-0 items-center justify-between">
            <Modal.Title variant="2lg-bold">필터</Modal.Title>
            <Modal.Close size="sm" onClose={() => setIsFilterOpen(false)} />
          </div>

          <div className="flex w-full flex-col gap-28">
            <section className="flex flex-col gap-8">
              <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
                이사 유형
              </Text>
              <div className="flex flex-wrap gap-12">
                {MOVE_TYPE_OPTIONS.map((moveType) => {
                  const isSelected = moveTypes.includes(moveType.value);
                  return (
                    <button
                      key={moveType.value}
                      type="button"
                      onClick={() => toggleMoveType(moveType.value)}
                      className={`rounded-full border px-12 py-6 text-sm ${
                        isSelected
                          ? "border-border-brand bg-background-brand-muted text-text-brand font-medium"
                          : "border-border-muted bg-background-subtle text-text-secondary font-medium"
                      }`}
                    >
                      {moveType.label}
                    </button>
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
                  <label key={filter.label} className="text-text-secondary flex items-center">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={filter.checked}
                      onChange={(event) => filter.onChange(event.target.checked)}
                    />
                    <span className="peer-focus-visible:ring-border-brand flex h-36 w-36 items-center justify-center rounded-md peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2">
                      <span
                        className={`rounded-4 flex h-20 w-20 items-center justify-center ${
                          filter.checked
                            ? "bg-background-brand"
                            : "border-border-default bg-background-surface border"
                        }`}
                      >
                        {filter.checked && (
                          <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} />
                        )}
                      </span>
                    </span>
                    {filter.label}
                  </label>
                ))}
              </div>
            </section>
          </div>

          <Modal.Button fullWidth size="detail" onClick={() => setIsFilterOpen(false)}>
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
