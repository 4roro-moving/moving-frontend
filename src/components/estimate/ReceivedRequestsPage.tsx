"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

import { Text } from "@/components/common/Text";
import { useMoverEstimateRequests } from "@/hooks/useMoverEstimateRequests";
import type { MoveType, RequestSort } from "@/types/moverEstimateRequest";

import ReceivedRequestCard from "./ReceivedRequestCard";

const MOVE_TYPES: { value: MoveType; label: string }[] = [
  { value: "SMALL", label: "소형이사" },
  { value: "HOME", label: "가정이사" },
  { value: "OFFICE", label: "사무실이사" },
];

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

  const items = query.data?.items ?? [];

  return (
    <div className="min-h-screen bg-white text-[#111]">
      <header className="border-b border-[#f2f2f2]">
        <div className="mx-auto flex h-[54px] max-w-[1600px] items-center justify-between px-24 min-[744px]:px-[72px] lg:h-[88px] lg:px-80">
          <div className="flex items-center gap-32 lg:gap-80">
            <div className="flex items-center gap-8">
              <Image
                src="/icons/moving-logo-icon.svg"
                alt="무빙"
                width={44}
                height={44}
                className="h-32 w-32 lg:h-11 lg:w-11"
              />
              <Image
                src="/icons/moving-logo-text.svg"
                alt=""
                width={68}
                height={35}
                className="hidden h-auto w-[68px] lg:block"
              />
            </div>
            <nav className="hidden items-center gap-40 text-lg font-bold lg:flex">
              <span>받은 요청</span>
              <span className="text-[#999]">내 견적 관리</span>
            </nav>
          </div>
          <span className="text-sm font-medium lg:text-lg">기사님</span>
        </div>
      </header>

      <div className="border-b border-[#f8f8f8]">
        <div className="mx-auto flex h-[54px] max-w-[1200px] items-center px-24 text-lg font-semibold min-[744px]:px-[72px] lg:h-[96px] lg:px-0 lg:text-2xl">
          받은 요청
        </div>
      </div>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-24 pb-80 min-[744px]:px-[72px] lg:gap-40 lg:px-0">
        <section className="flex flex-col gap-24">
          <form
            onSubmit={submitSearch}
            className="mx-10 flex h-[52px] w-[calc(100%-20px)] items-center gap-8 rounded-2xl bg-[#f7f7f7] px-16 lg:mx-0 lg:h-64 lg:w-full lg:px-24"
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
              className="w-full bg-transparent text-base outline-none placeholder:text-[#999] lg:text-lg"
              placeholder="어떤 고객님을 찾고 계세요?"
              aria-label="고객명 검색"
            />
          </form>

          <div className="hidden flex-wrap gap-12 lg:flex">
            {MOVE_TYPES.map((moveType) => {
              const isSelected = moveTypes.includes(moveType.value);
              return (
                <button
                  key={moveType.value}
                  type="button"
                  onClick={() => toggleMoveType(moveType.value)}
                  className={`rounded-full border px-20 py-2.5 text-base lg:text-lg ${isSelected ? "border-border-brand bg-background-brand-muted text-text-brand font-medium" : "border-[#d9d9d9] bg-[#fafafa] font-normal text-[#262524]"}`}
                >
                  {moveType.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-12 lg:gap-24">
          <Text as="p" variant="2lg-semibold" className="hidden text-[#262524] lg:block">
            전체 {items.length}건
          </Text>
          <div className="flex min-h-40 flex-wrap items-center justify-between gap-12 px-10 lg:px-0">
            <Text as="p" variant="md-semibold" className="text-[#262524] lg:hidden">
              전체 {items.length}건
            </Text>
            <div className="hidden flex-wrap items-center gap-12 text-base lg:flex">
              <label className="flex items-center gap-4">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={includeDesignated}
                  onChange={(event) => setIncludeDesignated(event.target.checked)}
                />
                <span className="flex h-36 w-36 items-center justify-center">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded ${includeDesignated ? "bg-background-brand" : "border border-[#dedede] bg-white"}`}
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
                <span className="flex h-36 w-36 items-center justify-center">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded ${serviceAreaOnly ? "bg-background-brand" : "border border-[#dedede] bg-white"}`}
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
                className="rounded-lg bg-white px-8 py-8 text-sm text-[#808080] outline-none"
              >
                <option value="requestedAt">요청일 빠른순</option>
                <option value="moveDate">이사 빠른순</option>
              </select>
              <button
                type="button"
                aria-label="필터 열기"
                onClick={() => setIsFilterOpen(true)}
                className="flex h-32 w-32 items-center justify-center rounded-lg border border-[#808080] lg:hidden"
              >
                <Image src="/icons/filter.svg" alt="" width={24} height={24} />
              </button>
            </div>
          </div>

          {query.isPending && (
            <Text as="p" variant="lg-regular" className="py-80 text-center text-[#999]">
              받은 요청을 불러오는 중이에요.
            </Text>
          )}
          {query.isError && (
            <Text as="p" variant="lg-regular" className="py-80 text-center text-[#ff4f64]">
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
              <Text as="p" variant="xl-regular" className="text-[#999]">
                아직 받은 요청이 없어요!
              </Text>
            </div>
          )}
          {items.length > 0 && (
            <div className="grid w-full grid-cols-1 gap-24 min-[744px]:max-w-[588px] lg:max-w-none lg:grid-cols-2">
              {items.map((request) => (
                <ReceivedRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </section>
      </main>

      {isFilterOpen && (
        <div
          className="bg-overlay-scrim fixed inset-0 z-50 flex items-end justify-center min-[744px]:items-center lg:hidden"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsFilterOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="필터"
            className="bg-background-surface flex w-full flex-col gap-32 rounded-t-[32px] px-24 pt-24 pb-32 shadow-[4px_4px_5px_rgba(169,169,169,0.2)] min-[744px]:w-[375px] min-[744px]:rounded-[32px]"
          >
            <div className="flex flex-col gap-20">
              <div className="flex items-center justify-between py-8 pr-8">
                <Text as="h2" variant="2lg-bold" className="text-text-primary">
                  필터
                </Text>
                <button
                  type="button"
                  aria-label="필터 닫기"
                  onClick={() => setIsFilterOpen(false)}
                  className="text-text-weak flex h-24 w-24 items-center justify-center text-xl"
                >
                  ×
                </button>
              </div>

              <div className="flex flex-col gap-28">
                <section className="flex flex-col gap-8">
                  <Text as="h3" variant="lg-semibold" className="text-text-tertiary">
                    이사 유형
                  </Text>
                  <div className="flex flex-wrap gap-12">
                    {MOVE_TYPES.map((moveType) => {
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
                        <span className="flex h-36 w-36 items-center justify-center">
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
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="rounded-12 bg-background-brand text-text-inverse flex h-[54px] w-full items-center justify-center font-semibold"
            >
              조회하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
