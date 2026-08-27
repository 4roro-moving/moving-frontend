"use client";

import { Text } from "@/components/common/Text";
import { useTranslations } from "next-intl";
import {
  MoverOfferedServiceChips,
  MoverServiceChip,
} from "@/components/mover/detail/MoverServiceChip";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverProfileMe } from "@/types/profile";

interface MoverMyPageActivityProps {
  profile: MoverProfileMe;
}

interface MoverMyPageServicesProps {
  profile: MoverProfileMe;
}

interface MoverMyPageRegionsProps {
  profile: MoverProfileMe;
}

export function MoverMyPageActivity({ profile }: MoverMyPageActivityProps) {
  const t = useTranslations("profile");
  const stats = [
    {
      label: t("myPageCompleted"),
      value: t("myPageCompletedCount", { count: profile.completedCount }),
    },
    { label: t("myPageReviews"), value: formatRating(profile.averageRating ?? 0) },
    { label: t("myPageCareer"), value: t("myPageCareerYears", { years: profile.career }) },
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
        {t("myPageActivity")}
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

export function MoverMyPageServices({ profile }: MoverMyPageServicesProps) {
  const t = useTranslations("profile");
  return (
    <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-types">
      <Text
        as="h2"
        id="mover-service-types"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-secondary"
      >
        {t("moverServices")}
      </Text>
      <MoverOfferedServiceChips serviceTypes={profile.serviceTypes} />
    </section>
  );
}

export function MoverMyPageRegions({ profile }: MoverMyPageRegionsProps) {
  const t = useTranslations("profile");
  const tMoverSearch = useTranslations("moverSearch");
  return (
    <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-regions">
      <Text
        as="h2"
        id="mover-service-regions"
        variant={{ base: "lg-semibold", md: "xl-semibold" }}
        className="text-text-secondary"
      >
        {t("moverRegions")}
      </Text>
      <div className="flex flex-wrap gap-12">
        {profile.regions.map((region) => (
          <MoverServiceChip
            key={region.id}
            label={tMoverSearch(`regions.${region.id}`)}
            variant="region"
          />
        ))}
      </div>
    </section>
  );
}
