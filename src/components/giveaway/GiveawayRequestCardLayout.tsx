import { useFormatter, useTranslations } from "next-intl";
import type { ReactNode } from "react";

import ResidenceReviewInfoItem from "@/components/residence-review/ResidenceReviewInfoItem";
import {} from "@/lib/constants/giveaway";

interface GiveawayRequestCardLayoutProps {
  labelledBy: string;
  statusLabel: string;
  createdAt: string;
  children: ReactNode;
  actions?: ReactNode;
}

const InfoDivider = () => {
  return (
    <span className="bg-border-subtle hidden h-50 w-px shrink-0 md:block" aria-hidden="true" />
  );
};

const GiveawayRequestCardLayout = ({
  labelledBy,
  statusLabel,
  createdAt,
  children,
  actions,
}: GiveawayRequestCardLayoutProps) => {
  const t = useTranslations("giveaway");
  const format = useFormatter();
  const date = new Date(createdAt);
  const appliedDate = Number.isNaN(date.getTime())
    ? ""
    : format.dateTime(date, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

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
              label={t("requestStatusCompact")}
              value={statusLabel}
              className="md:hidden"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <ResidenceReviewInfoItem
              label={t("requestStatus")}
              value={statusLabel}
              className="hidden md:flex"
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
            <InfoDivider />
            <ResidenceReviewInfoItem
              label={t("requestDate")}
              value={appliedDate}
              labelVariant={{ base: "xs-regular", md: "md-regular" }}
              valueVariant={{ base: "sm-medium", md: "lg-regular" }}
            />
          </dl>
        </div>

        {actions ? (
          <div className="flex w-full flex-col gap-8 xl:w-160 xl:shrink-0">{actions}</div>
        ) : null}
      </div>
    </article>
  );
};

export default GiveawayRequestCardLayout;
