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
const OFFER_LIST_CLASS_NAME = "flex w-full flex-col items-start";

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
          className="w-128 md:w-160"
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
        <ul className={OFFER_LIST_CLASS_NAME}>
          <li className="w-full">
            <div className="bg-background-default flex w-full flex-col items-stretch gap-8 border-0 py-20 md:px-8">
              <div className="border-border-muted rounded-12 flex min-h-268 w-full items-center border border-solid px-12 py-12 pr-20 shadow-none">
                <EstimatesQueryStatus
                  message="해당 조건의 견적이 없어요."
                  className="min-h-0 px-0 py-0"
                />
              </div>
            </div>
          </li>
        </ul>
      ) : (
        <ul className={OFFER_LIST_CLASS_NAME}>
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
