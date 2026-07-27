"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import Modal from "@/components/common/Modal";
import { Text } from "@/components/common/Text";
import { useMoverEstimateRequests } from "@/hooks/useMoverEstimateRequests";
import type { RequestSort } from "@/types/moverEstimateRequest";
import type { MoveType } from "@/types/move";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";

import ReceivedRequestCard from "./ReceivedRequestCard";

export default function ReceivedRequestsPage() {
  const [searchText, setSearchText] = useState("");
  const [keyword, setKeyword] = useState("");
  const [moveTypes, setMoveTypes] = useState<MoveType[]>([]);
  const [includeDesignated, setIncludeDesignated] = useState(false);
  const [serviceAreaOnly, setServiceAreaOnly] = useState(false);
  const [sort, setSort] = useState<RequestSort>("requestedAt");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const query = useMoverEstimateRequests({
    keyword: keyword || undefined,
    moveType: moveTypes.length ? moveTypes : undefined,
    isDesignated: includeDesignated ? true : undefined,
    isServiceArea: serviceAreaOnly ? true : undefined,
    sort,
    limit: 10,
  });

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

  const items = query.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = query.data?.pages[0]?.pagination.totalCount ?? 0;

  return (
    <>
      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 min-[744px]:px-[72px] lg:gap-40 lg:px-0">
        <section className="flex flex-col gap-24">
          <form
            onSubmit={submitSearch}
            className="bg-background-muted mx-10 flex h-[52px] w-[calc(100%_-_20px)] items-center gap-8 rounded-2xl px-16 lg:mx-0 lg:h-64 lg:w-full lg:px-24"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={36}
              height={36}
              className="h-24 w-24 lg:h-36 lg:w-36"
            />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="placeholder:text-text-placeholder w-full bg-transparent text-base outline-none lg:text-lg"
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
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as RequestSort)}
                className="bg-background-surface text-text-muted rounded-lg px-8 py-8 text-sm outline-none"
              >
                <option value="requestedAt">요청일 빠른순</option>
                <option value="moveDate">이사 빠른순</option>
              </select>
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
                  <ReceivedRequestCard key={request.id} request={request} />
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

      <Modal
        open={isFilterOpen}
        title="필터"
        confirmLabel="조회하기"
        onConfirm={() => setIsFilterOpen(false)}
        onClose={() => setIsFilterOpen(false)}
        overlayClassName="items-end px-0 min-[744px]:items-center min-[744px]:px-24 lg:hidden"
        className="rounded-t-32 min-[744px]:rounded-32 max-w-none gap-32 px-24 pt-24 pb-32 min-[744px]:w-[375px]"
      >
        <div className="flex flex-col gap-28">
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
      </Modal>
    </>
  );
}
