"use client";

import { Text } from "@/components/common/Text";
import {
  MoverOfferedServiceChips,
  MoverServiceChip,
} from "@/components/mover/detail/MoverServiceChip";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverProfileMe } from "@/types/profile";

export function MoverMyPageActivity({ profile }: { profile: MoverProfileMe }) {
  const stats = [
    { label: "진행", value: `${profile.completedCount}건` },
    { label: "리뷰", value: formatRating(profile.averageRating ?? 0) },
    { label: "총 경력", value: `${profile.career}년` },
  ];

  return (
    <section
      className="flex w-full flex-col gap-8 md:gap-16"
      aria-labelledby="mover-mypage-activity"
    >
      <Text
        as="h2"
        id="mover-mypage-activity"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-secondary"
      >
        활동 현황
      </Text>

      <div className="border-border-subtle bg-background-subtle h-mypage-activity-mobile rounded-16 flex items-center justify-between border px-40 md:h-120 md:px-160">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center text-center">
            <Text variant={{ base: "md-regular", md: "lg-regular" }} className="text-text-tertiary">
              {stat.label}
            </Text>
            <Text
              variant={{ base: "2lg-bold", md: "xl-bold" }}
              className="text-text-brand whitespace-nowrap"
            >
              {stat.value}
            </Text>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MoverMyPageServices({ profile }: { profile: MoverProfileMe }) {
  return (
    <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-types">
      <Text
        as="h2"
        id="mover-service-types"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-secondary"
      >
        제공 서비스
      </Text>
      <MoverOfferedServiceChips serviceTypes={profile.serviceTypes} />
    </section>
  );
}

export function MoverMyPageRegions({ profile }: { profile: MoverProfileMe }) {
  return (
    <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-regions">
      <Text
        as="h2"
        id="mover-service-regions"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-secondary"
      >
        서비스 가능 지역
      </Text>
      <div className="flex flex-wrap gap-12">
        {profile.regions.map((region) => (
          <MoverServiceChip key={region.id} label={region.name} variant="region" />
        ))}
      </div>
    </section>
  );
}
