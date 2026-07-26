"use client";

import { useState } from "react";

import Pagination from "@/components/common/Pagination/Pagination";
import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MOCK_FAVORITE_MOVERS, MOCK_MOVERS, SORT_OPTIONS } from "@/components/mover/constants";
import { MOVE_TYPE_OPTIONS } from "@/lib/constants/moveType";
import { REGION_OPTIONS } from "@/lib/constants/region";
import type { MoveType } from "@/types/move";
import type { MoverSort } from "@/types/mover";

const PAGE_SIZE = 4;
const ALL_OPTION = { value: "all", label: "전체" } as const;

const REGION_FILTER_OPTIONS = [
  ALL_OPTION,
  ...REGION_OPTIONS.map((region) => ({
    value: String(region.value),
    label: region.label,
  })),
];

const SERVICE_FILTER_OPTIONS = [ALL_OPTION, ...MOVE_TYPE_OPTIONS];

function filterAndSortMovers(keyword: string, service: string, sort: MoverSort) {
  let filtered = MOCK_MOVERS;

  if (keyword.trim()) {
    const query = keyword.trim().toLowerCase();
    filtered = filtered.filter(
      (mover) =>
        mover.name.toLowerCase().includes(query) ||
        mover.title.toLowerCase().includes(query) ||
        mover.description.toLowerCase().includes(query),
    );
  }

  if (service && service !== ALL_OPTION.value) {
    filtered = filtered.filter((mover) => mover.serviceType === (service as MoveType));
  }

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "rating":
        return b.rating - a.rating;
      case "career":
        return b.careerYears - a.careerYears;
      case "confirmedCount":
        return b.confirmedCount - a.confirmedCount;
      case "reviewCount":
      default:
        return b.reviewCount - a.reviewCount;
    }
  });
}

export function MoversPageClient() {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState<string>(ALL_OPTION.value);
  const [service, setService] = useState<string>(ALL_OPTION.value);
  const [sort, setSort] = useState<MoverSort>("reviewCount");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKey, setFilterKey] = useState(0);

  const movers = filterAndSortMovers(keyword, service, sort);
  const pageCount = Math.max(1, Math.ceil(movers.length / PAGE_SIZE));
  const pagedMovers = movers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleReset() {
    setKeyword("");
    setRegion(ALL_OPTION.value);
    setService(ALL_OPTION.value);
    setSort("reviewCount");
    setCurrentPage(1);
    setFilterKey((prev) => prev + 1);
  }

  function handleKeywordChange(value: string) {
    setKeyword(value);
    setCurrentPage(1);
  }

  function handleRegionChange(value: string) {
    setRegion(value);
    setCurrentPage(1);
  }

  function handleServiceChange(value: string) {
    setService(value);
    setCurrentPage(1);
  }

  function handleSortChange(value: string) {
    setSort(value as MoverSort);
    setCurrentPage(1);
  }

  return (
    <div className="bg-background-default flex w-full flex-col">
      <div className="bg-background-default shadow-[0px_2px_10px_0px_rgba(248,248,248,0.1)]">
        <div className="h-page-header-height-mobile px-margin-mobile min-[744px]:h-page-header-height-tablet lg:h-page-header-height-desktop mx-auto flex w-full max-w-[var(--container-desktop)] items-center min-[744px]:px-72 lg:px-0">
          <Text as="h1" variant="2xl-semibold" className="text-text-primary">
            기사님 찾기
          </Text>
        </div>
      </div>

      <div className="px-margin-mobile mx-auto flex w-full max-w-[var(--container-desktop)] flex-col gap-40 pt-24 pb-80 min-[744px]:px-72 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:px-0 lg:pt-0 lg:pb-[165px]">
        <section
          className="flex w-full flex-col gap-24 min-[744px]:gap-32 lg:w-[820px] lg:gap-[37px]"
          aria-label="기사님 목록"
        >
          <div className="w-full py-10">
            <Search
              size="md"
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              placeholder="텍스트를 입력해 주세요."
              aria-label="기사님 검색"
              className="h-52 w-full gap-8 px-16 min-[744px]:h-64 min-[744px]:px-24"
            />
          </div>

          <div className="flex flex-col gap-16 min-[744px]:flex-row min-[744px]:items-center min-[744px]:justify-between">
            <div className="flex flex-wrap items-center gap-24">
              <div className="flex flex-wrap items-center gap-12">
                <div className="w-[160px]">
                  <Select
                    key={`region-${filterKey}`}
                    desc="지역"
                    size="lg"
                    columns={2}
                    className="w-full"
                    defaultValue={region}
                    placeholderValue={ALL_OPTION.value}
                    onChange={handleRegionChange}
                  >
                    {REGION_FILTER_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="w-[160px]">
                  <Select
                    key={`service-${filterKey}`}
                    desc="서비스"
                    size="lg"
                    className="w-full"
                    defaultValue={service}
                    placeholderValue={ALL_OPTION.value}
                    onChange={handleServiceChange}
                  >
                    {SERVICE_FILTER_OPTIONS.map((option) => (
                      <Select.Option key={option.value} value={option.value}>
                        {option.label}
                      </Select.Option>
                    ))}
                  </Select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-text-weak hover:text-text-muted transition-colors"
              >
                <Text as="span" variant="lg-medium">
                  초기화
                </Text>
              </button>
            </div>

            <div className="w-[114px]">
              <Select
                key={`sort-${filterKey}`}
                desc="정렬"
                size="lg"
                variant="sort"
                className="w-full"
                defaultValue={sort}
                onChange={handleSortChange}
              >
                {SORT_OPTIONS.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          <ul className="flex flex-col gap-20">
            {pagedMovers.map((mover) => (
              <li key={mover.id}>
                <MoverCard mover={mover} variant="full" />
              </li>
            ))}
          </ul>

          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            onPageChange={setCurrentPage}
            className="flex justify-center"
          />
        </section>

        <aside
          className="flex w-full flex-col gap-16 lg:w-[327px] lg:shrink-0 lg:self-stretch lg:pt-[192px]"
          aria-label="찜한 기사님"
        >
          <Text as="h2" variant="xl-semibold" className="text-text-secondary">
            찜한 기사님
          </Text>
          <ul className="flex flex-col gap-16">
            {MOCK_FAVORITE_MOVERS.map((mover) => (
              <li key={mover.id}>
                <MoverCard mover={mover} variant="compact" />
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
