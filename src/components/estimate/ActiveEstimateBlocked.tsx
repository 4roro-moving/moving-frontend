"use client";

import type { ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";

interface ActiveEstimateBlockedProps {
  imageSrc?: string;
  description?: ReactNode;
  buttonLabel?: string;
  href?: string;
}

const DEFAULT_DESCRIPTION = (
  <>
    현재 진행 중인 이사 견적이 있어요!
    <br />
    진행 중인 이사 완료 후 새로운 견적을 받아보세요.
  </>
);

export default function ActiveEstimateBlocked({
  imageSrc = "/images/empty/moving-car.png",
  description = DEFAULT_DESCRIPTION,
  buttonLabel,
  href,
}: ActiveEstimateBlockedProps) {
  return (
    <EmptyState
      imageSrc={imageSrc}
      description={description}
      buttonLabel={buttonLabel}
      href={href}
    />
  );
}
