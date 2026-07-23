"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/common/Text";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import type { EstimateOffer, EstimateOfferFilter } from "@/types/estimate";

import EstimateOfferCard from "./EstimateOfferCard";

const FILTER_OPTIONS: { value: EstimateOfferFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "confirmed", label: "확정견적" },
  { value: "pending", label: "견적대기" },
];

interface EstimateOfferSectionProps {
  offers: EstimateOffer[];
}

export default function EstimateOfferSection({ offers }: EstimateOfferSectionProps) {
  const [filter, setFilter] = useState<EstimateOfferFilter>("all");
  const [open, setOpen] = useState(false);

  const filteredOffers = useMemo(() => {
    if (filter === "all") return offers;
    return offers.filter((offer) => offer.status === filter);
  }, [filter, offers]);

  const selectedLabel = FILTER_OPTIONS.find((option) => option.value === filter)?.label ?? "전체";

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

      <div className="relative w-fit">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            "bg-background-surface border-border-default rounded-12 flex h-[50px] items-center border border-solid py-16 pr-12 pl-20 shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)]",
          )}
        >
          <Text as="span" variant="lg-medium" className="text-text-secondary w-[92px]">
            {selectedLabel}
          </Text>
          <ChevronDownIcon
            className={cn(
              "text-icon-default size-36 shrink-0 transition-transform",
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>

        {open && (
          <ul
            role="menu"
            aria-label="견적서 필터"
            className="bg-background-surface border-border-default rounded-12 absolute top-full left-0 z-10 mt-4 w-full overflow-hidden border border-solid shadow-[4px_4px_5px_0_rgba(195,217,242,0.2)]"
          >
            {FILTER_OPTIONS.map((option) => (
              <li key={option.value} role="none">
                <button
                  type="button"
                  role="menuitem"
                  className={cn(
                    "hover:bg-background-muted flex h-[50px] w-full items-center px-20 text-left",
                    filter === option.value && "bg-background-subtle",
                  )}
                  onClick={() => {
                    setFilter(option.value);
                    setOpen(false);
                  }}
                >
                  <Text as="span" variant="lg-medium" className="text-text-secondary">
                    {option.label}
                  </Text>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="flex w-full flex-col items-start">
        {filteredOffers.map((offer) => (
          <li key={offer.id} className="w-full">
            <EstimateOfferCard offer={offer} />
          </li>
        ))}
      </ul>
    </section>
  );
}
