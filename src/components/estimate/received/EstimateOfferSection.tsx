"use client";

import { useMemo, useState } from "react";

import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import type { EstimateOfferFilter, MoveType, ReceivedEstimateListItem } from "@/types/estimate";

import EstimateOfferCard from "./EstimateOfferCard";

const FILTER_OPTIONS: { value: EstimateOfferFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "확정견적" },
  { value: "pending", label: "견적대기" },
];

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
  const filteredOffers = useMemo(() => {
    if (filter === "all") return offers;
    if (filter === "confirmed") {
      return offers.filter((offer) => offer.status === "CONFIRMED");
    }
    return offers.filter((offer) => offer.status === "SENT");
  }, [filter, offers]);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-20" aria-label="견적서 목록">
      <div className="flex items-start gap-8">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
          견적서 목록
        </Text>
        <Text as="span" variant="xl-semibold" className="text-text-brand">
          {offers.length}
        </Text>
      </div>

      <Select
        desc="전체"
        defaultValue="all"
        size="lg"
        className="w-[160px]"
        onChange={(value) => setFilter(value as EstimateOfferFilter)}
      >
        {FILTER_OPTIONS.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>

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
    </section>
  );
}
