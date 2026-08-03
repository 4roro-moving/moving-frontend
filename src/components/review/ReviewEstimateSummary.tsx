import Image from "next/image";

import { Text } from "@/components/common/Text";
import { DesignatedChip, MoveTypeChip } from "@/components/estimate/received/MoveTypeChip";
import { ArrowRightIcon, DriverBadgeIcon, ProfileDefaultIcon } from "@/icons";
import { formatMoveDateLabelSafe, getReviewMoverDisplayName } from "@/lib/utils/estimateFormat";
import type { ReviewableEstimateItem } from "@/types/review";

interface ReviewEstimateSummaryProps {
  item: ReviewableEstimateItem;
}

const LABEL_VARIANT = { base: "xs-regular", xl: "md-regular" } as const;
const VALUE_VARIANT = { base: "sm-medium", xl: "lg-regular" } as const;

function summarizeAddress(address: string): string {
  const [region = "", district = ""] = address.trim().split(/\s+/);
  const shortenedRegion = region.replace(/특별시$/, "시").replace(/광역시$/, "시");

  return [shortenedRegion, district].filter(Boolean).join(" ");
}

function RouteField({
  label,
  value,
  fullValue = value,
}: {
  label: string;
  value: string;
  fullValue?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col items-start justify-center">
      <Text as="dt" variant={LABEL_VARIANT} className="text-text-muted">
        {label}
      </Text>
      <Text
        as="dd"
        variant={VALUE_VARIANT}
        className="text-text-secondary m-0 whitespace-nowrap"
        title={fullValue}
      >
        {value}
      </Text>
    </div>
  );
}

export default function ReviewEstimateSummary({ item }: ReviewEstimateSummaryProps) {
  const { estimateRequest, mover } = item;
  const moverLabel = getReviewMoverDisplayName(mover);

  return (
    <section className="flex w-full flex-col gap-14 xl:gap-16">
      <div className="flex flex-wrap items-center gap-8 xl:gap-12">
        <MoveTypeChip moveType={estimateRequest.moveType} size="sm" className="xl:hidden" />
        <MoveTypeChip
          moveType={estimateRequest.moveType}
          size="md"
          className="hidden xl:inline-flex"
        />
        {estimateRequest.isDesignated ? (
          <>
            <DesignatedChip size="sm" className="xl:hidden" />
            <DesignatedChip size="md" className="hidden xl:inline-flex" />
          </>
        ) : null}
      </div>

      <div className="flex flex-col gap-12">
        <div className="flex w-full items-center justify-between gap-16">
          <div className="flex min-w-0 flex-col items-start justify-center gap-4">
            <DriverBadgeIcon className="h-[18.2px] w-16 shrink-0 xl:h-23 xl:w-20" />
            <Text
              as="p"
              variant={{ base: "lg-semibold", xl: "2lg-semibold" }}
              className="text-text-secondary truncate"
            >
              {moverLabel}
            </Text>
          </div>

          <div className="bg-background-avatar rounded-12 relative size-50 shrink-0 overflow-hidden">
            {mover.imageUrl ? (
              <Image
                src={mover.imageUrl}
                alt={`${moverLabel} 프로필`}
                fill
                sizes="50px"
                className="object-cover"
              />
            ) : (
              <ProfileDefaultIcon className="size-full" />
            )}
          </div>
        </div>

        <div className="bg-border-subtle h-px w-full" />

        <dl className="flex w-full items-end justify-between gap-12 xl:justify-start xl:gap-40">
          <div className="flex min-w-0 items-end gap-12">
            <RouteField
              label="출발지"
              value={summarizeAddress(estimateRequest.fromAddress)}
              fullValue={estimateRequest.fromAddress}
            />
            <span className="flex h-22 shrink-0 items-center xl:h-26" aria-hidden="true">
              <ArrowRightIcon size={12} className="xl:hidden" />
              <ArrowRightIcon size={16} className="hidden xl:block" />
            </span>
            <RouteField
              label="도착지"
              value={summarizeAddress(estimateRequest.toAddress)}
              fullValue={estimateRequest.toAddress}
            />
          </div>

          <RouteField label="이사일" value={formatMoveDateLabelSafe(estimateRequest.moveDate)} />
        </dl>

        <div className="bg-border-subtle h-px w-full" />
      </div>
    </section>
  );
}
