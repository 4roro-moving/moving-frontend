import type { ReactNode } from "react";

import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import {
  GIVEAWAY_REQUEST_DATE_LABEL,
  GIVEAWAY_REQUEST_STATUS_FIELD_LABEL,
  GIVEAWAY_REQUEST_STATUS_FIELD_LABEL_COMPACT,
} from "@/lib/constants/giveaway";
import { formatKoreanDateTime } from "@/lib/utils/date";

interface GiveawayRequestCardLayoutProps {
  labelledBy: string;
  statusLabel: string;
  createdAt: string;
  children: ReactNode;
  extra?: ReactNode;
  actions?: ReactNode;
}

const InfoDivider = () => {
  return (
    <span className="bg-border-subtle hidden h-50 w-px shrink-0 md:block" aria-hidden="true" />
  );
};

const formatRequestDate = (value: string): string => {
  try {
    return formatKoreanDateTime(value);
  } catch {
    return "";
  }
};

const GiveawayRequestCardLayout = ({
  labelledBy,
  statusLabel,
  createdAt,
  children,
  extra,
  actions,
}: GiveawayRequestCardLayoutProps) => {
  const appliedDate = formatRequestDate(createdAt);

  return (
    <article
      aria-labelledby={labelledBy}
      className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex w-full flex-col gap-16 border-[0.5px] px-20 py-24 md:gap-24 md:px-32 md:py-32 xl:px-40"
    >
      <div className="flex w-full flex-col gap-16 xl:flex-row xl:items-center xl:gap-12">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {children}

          <dl className="flex w-full flex-col gap-16 md:flex-row md:items-center md:gap-20">
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_STATUS_FIELD_LABEL_COMPACT}
              value={statusLabel}
              className="md:hidden"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_STATUS_FIELD_LABEL}
              value={statusLabel}
              className="hidden md:flex"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <InfoDivider />
            <ResidenceReviewInfoItem
              label={GIVEAWAY_REQUEST_DATE_LABEL}
              value={appliedDate}
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
          </dl>

          {extra}
        </div>

        {actions ? (
          <div className="flex w-full flex-col gap-8 xl:w-160 xl:shrink-0">{actions}</div>
        ) : null}
      </div>
    </article>
  );
};

export default GiveawayRequestCardLayout;
