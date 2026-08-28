"use client";

import { useTranslations } from "next-intl";
import type { MouseEventHandler, ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";

interface ActiveEstimateBlockedProps {
  imageSrc?: string;
  description?: ReactNode;
  buttonLabel?: string;
  href?: string;
  onButtonClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function ActiveEstimateBlocked({
  imageSrc = "/images/empty/moving-car.png",
  description,
  buttonLabel,
  href,
  onButtonClick,
}: ActiveEstimateBlockedProps) {
  const t = useTranslations("estimateRequest");
  const resolvedDescription = description ?? (
    <>
      {t("activeBlockedTitle")}
      <br />
      {t("activeBlockedDescription")}
    </>
  );

  return (
    <EmptyState
      imageSrc={imageSrc}
      description={resolvedDescription}
      buttonLabel={buttonLabel}
      href={href}
      onButtonClick={onButtonClick}
    />
  );
}
