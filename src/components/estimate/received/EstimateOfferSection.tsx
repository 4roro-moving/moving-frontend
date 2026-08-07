"use client";

import { useMemo, useState } from "react";

import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import { isConfirmedEstimate } from "@/lib/utils/estimateFormat";
import type { EstimateOfferFilter, ReceivedEstimateListItem } from "@/types/estimate";
import type { MoveType } from "@/types/move";

import EstimateOfferCard from "./EstimateOfferCard";

const FILTER_OPTIONS: { value: EstimateOfferFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "확정 견적" },
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

  const filteredOffers = useMemo(() => {
    if (filter === "confirmed") {
      return offers.filter((offer) => isConfirmedEstimate(offer.status));
    }
    return offers;
  }, [filter, offers]);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-16 md:gap-20" aria-label="견적 목록">
      <div className="flex items-start gap-8">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
          견적 목록
        </Text>
        <Text as="span" variant="xl-semibold" className="text-text-brand">
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
        <div className="bg-background-surface border-border-subtle rounded-20 border-[0.5px]">
          <EstimatesQueryStatus
            message="해당 조건의 견적이 없어요."
            className="min-h-[220px] px-20 py-24 md:min-h-[260px] md:px-28 md:py-32 xl:px-40 xl:py-40"
          />
        </div>
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
