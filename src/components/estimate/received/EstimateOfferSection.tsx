"use client";

import { useMemo, useState } from "react";

import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import { isConfirmedEstimate } from "@/lib/utils/estimateFormat";
import type { EstimateOfferFilter, ReceivedEstimateListItem } from "@/types/estimate";
import type { MoveType } from "@/types/move";

import EstimateOfferCard from "./EstimateOfferCard";

// 2026.07.29 정슬기 - [수정] Figma 드롭다운과 동일하게 전체 / 확정견적만 유지
const FILTER_OPTIONS: { value: EstimateOfferFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "확정견적" },
];

const FILTER_VALUES = new Set<EstimateOfferFilter>(FILTER_OPTIONS.map((option) => option.value));

function isEstimateOfferFilter(value: string): value is EstimateOfferFilter {
  return FILTER_VALUES.has(value as EstimateOfferFilter);
}

interface EstimateOfferSectionProps {
  offers: ReceivedEstimateListItem[];
  moveType: MoveType;
  onFavoriteError?: (message: string) => void;
}

export default function EstimateOfferSection({
  offers,
  moveType,
  onFavoriteError,
}: EstimateOfferSectionProps) {
  const [filter, setFilter] = useState<EstimateOfferFilter>("all");

  // 2026.07.24 정슬기 - [수정] SENT/CONFIRMED 상태로 대기·확정 견적 분리
  // 2026.07.29 정슬기 - [수정] pending 필터 분기 제거 — 확정견적만 필터
  const filteredOffers = useMemo(() => {
    if (filter === "confirmed") {
      return offers.filter((offer) => isConfirmedEstimate(offer.status));
    }
    return offers;
  }, [filter, offers]);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-16 md:gap-20" aria-label="견적서 목록">
      <div className="flex items-start gap-8">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
          견적서 목록
        </Text>
        <Text as="span" variant="xl-semibold" className="text-text-brand">
          {/* 2026.07.24 정슬기 - [수정] 필터 적용 후 개수 표시 */}
          {filteredOffers.length}
        </Text>
      </div>

      <div className="flex flex-col gap-4">
        <Select
          label="견적 상태 필터"
          desc="전체"
          defaultValue="all"
          size="lg"
          className="w-[128px] md:w-[160px]"
          onChange={(value) => {
            if (isEstimateOfferFilter(value)) {
              setFilter(value);
            }
          }}
        >
          {FILTER_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      {filteredOffers.length === 0 ? (
        <Text as="p" variant="md-regular" className="text-text-muted py-24">
          해당 조건의 견적이 없습니다.
        </Text>
      ) : (
        <ul className="flex w-full flex-col items-start">
          {filteredOffers.map((offer) => (
            <li key={offer.id} className="w-full">
              <EstimateOfferCard
                offer={offer}
                moveType={moveType}
                onFavoriteError={onFavoriteError}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
