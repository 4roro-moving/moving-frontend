"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

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
  const [includeDesignated, setIncludeDesignated] = useState(true);
  const [serviceAreaOnly, setServiceAreaOnly] = useState(true);
  const [sort, setSort] = useState<RequestSort>("requestedAt");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const query = useMoverEstimateRequests({
    keyword: keyword || undefined,
    moveType: moveTypes.length ? moveTypes : undefined,
    isDesignated: includeDesignated ? undefined : false,
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
        <div className="mx-auto flex h-[54px] max-w-[1600px] items-center justify-between px-6 md:px-[72px] lg:h-[88px] lg:px-20">
          <div className="flex items-center gap-8 lg:gap-20">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/moving-logo-icon.svg"
                alt="무빙"
                width={44}
                height={44}
                className="h-8 w-8 lg:h-11 lg:w-11"
              />
              <Image
                src="/icons/moving-logo-text.svg"
                alt=""
                width={68}
                height={35}
                className="hidden h-auto w-[68px] lg:block"
              />
            </div>
            <nav className="hidden items-center gap-10 text-lg font-bold lg:flex">
              <span>받은 요청</span>
              <span className="text-[#999]">내 견적 관리</span>
            </nav>
          </div>
          <span className="text-sm font-medium lg:text-lg">기사님</span>
        </div>
      </header>

      <div className="border-b border-[#f8f8f8]">
        <div className="mx-auto flex h-[54px] max-w-[1200px] items-center px-6 text-lg font-semibold md:px-0 lg:h-24 lg:text-2xl">
          받은 요청
        </div>
      </div>

      <main className="mx-auto flex max-w-[1200px] flex-col gap-0 px-6 pb-20 md:px-[72px] lg:gap-10 lg:px-0">
        <section className="flex flex-col gap-6">
          <form
            onSubmit={submitSearch}
            className="flex h-[52px] items-center gap-2 rounded-2xl bg-[#f7f7f7] px-4 lg:h-16 lg:px-6"
          >
            <Image
              src="/icons/search.svg"
              alt=""
              width={36}
              height={36}
              className="h-7 w-7 lg:h-9 lg:w-9"
            />
            <input
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              className="w-full bg-transparent text-base outline-none placeholder:text-[#999] lg:text-lg"
              placeholder="어떤 고객님을 찾고 계세요?"
              aria-label="고객명 검색"
            />
          </form>

          <div className="hidden flex-wrap gap-3 lg:flex">
            {MOVE_TYPES.map((moveType) => {
              const isSelected = moveTypes.includes(moveType.value);
              return (
                <button
                  key={moveType.value}
                  type="button"
                  onClick={() => toggleMoveType(moveType.value)}
                  className={`rounded-full border px-5 py-2.5 text-base lg:text-lg ${isSelected ? "border-brand-400 text-brand-400" : "border-[#d9d9d9] bg-[#fafafa] text-[#262524]"}`}
                >
                  {moveType.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3 lg:gap-6">
          <p className="hidden text-lg font-semibold text-[#262524] lg:block">
            전체 {items.length}건
          </p>
          <div className="flex min-h-10 flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-[#262524] lg:hidden">전체 {items.length}건</p>
            <div className="hidden flex-wrap items-center gap-3 text-base lg:flex">
              <label className="flex items-center gap-1">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={includeDesignated}
                  onChange={(event) => setIncludeDesignated(event.target.checked)}
                />
                <span className="flex h-9 w-9 items-center justify-center">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded ${includeDesignated ? "bg-brand-400" : "border border-[#dedede] bg-white"}`}
                  >
                    {includeDesignated && (
                      <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} />
                    )}
                  </span>
                </span>
                지정 견적 요청
              </label>
              <label className="flex items-center gap-1">
                <input
                  className="peer sr-only"
                  type="checkbox"
                  checked={serviceAreaOnly}
                  onChange={(event) => setServiceAreaOnly(event.target.checked)}
                />
                <span className="flex h-9 w-9 items-center justify-center">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded ${serviceAreaOnly ? "bg-brand-400" : "border border-[#dedede] bg-white"}`}
                  >
                    {serviceAreaOnly && (
                      <Image src="/icons/checkbox-check.svg" alt="" width={10} height={6} />
                    )}
                  </span>
                </span>
                서비스 가능 지역
              </label>
            </div>
            <div className="flex items-center gap-1">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as RequestSort)}
                className="rounded-lg bg-white px-2 py-2 text-sm text-[#808080] outline-none"
              >
                <option value="requestedAt">요청일 빠른순</option>
                <option value="moveDate">이사 빠른순</option>
              </select>
              <button
                type="button"
                aria-label="필터 열기"
                onClick={() => setIsFilterOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#808080] lg:hidden"
              >
                <Image src="/icons/filter.svg" alt="" width={24} height={24} />
              </button>
            </div>
          </div>

          {query.isPending && (
            <p className="py-20 text-center text-[#999]">받은 요청을 불러오는 중이에요.</p>
          )}
          {query.isError && (
            <p className="py-20 text-center text-[#ff4f64]">받은 요청을 불러오지 못했어요.</p>
          )}
          {!query.isPending && !query.isError && items.length === 0 && (
            <div className="flex flex-col items-center gap-8 py-24">
              <Image
                className="opacity-50"
                src="/images/empty-received-requests.png"
                alt=""
                width={240}
                height={196}
              />
              <p className="text-xl text-[#999]">아직 받은 요청이 없어요!</p>
            </div>
          )}
          {items.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {items.map((request) => (
                <ReceivedRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </section>
      </main>

      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 lg:hidden">
          <div className="w-full max-w-[420px] rounded-t-[20px] bg-white px-6 pt-8 pb-6">
            <h2 className="mb-6 text-xl font-semibold">필터</h2>
            <div className="mb-8 flex flex-wrap gap-3">
              {MOVE_TYPES.map((moveType) => {
                const isSelected = moveTypes.includes(moveType.value);
                return (
                  <button
                    key={moveType.value}
                    type="button"
                    onClick={() => toggleMoveType(moveType.value)}
                    className={`rounded-full border px-4 py-2 ${isSelected ? "border-brand-400 text-brand-400" : "border-[#d9d9d9] text-[#262524]"}`}
                  >
                    {moveType.label}
                  </button>
                );
              })}
            </div>
            <div className="mb-8 flex flex-col gap-4">
              <label className="flex items-center justify-between">
                지정 견적 요청 포함
                <input
                  type="checkbox"
                  checked={includeDesignated}
                  onChange={(event) => setIncludeDesignated(event.target.checked)}
                  className="h-5 w-5 accent-[#f9502e]"
                />
              </label>
              <label className="flex items-center justify-between">
                서비스 가능 지역만 보기
                <input
                  type="checkbox"
                  checked={serviceAreaOnly}
                  onChange={(event) => setServiceAreaOnly(event.target.checked)}
                  className="h-5 w-5 accent-[#f9502e]"
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() => setIsFilterOpen(false)}
              className="bg-brand-400 h-14 w-full rounded-xl font-semibold text-white"
            >
              적용하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
