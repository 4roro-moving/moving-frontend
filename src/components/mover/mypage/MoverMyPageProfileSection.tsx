"use client";

import { useTranslations } from "next-intl";
import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { ProfileImage } from "@/components/common/ProfileImage";
import { Text } from "@/components/common/Text";
import {
  MoverOfferedServiceChips,
  MoverServiceChip,
} from "@/components/mover/detail/MoverServiceChip";
import { DriverBadgeIcon, LikeIcon } from "@/icons";
import { formatRating } from "@/lib/utils/estimateFormat";
import type { MoverProfileMe } from "@/types/profile";

import MoverMyPageEditActions from "./MoverMyPageEditActions";

interface MoverMyPageProfileSectionProps {
  profile: MoverProfileMe;
  favoriteCount: number;
  isFavoriteCountLoading: boolean;
}

function ActivitySummary({ profile }: { profile: MoverProfileMe }) {
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
        className="text-text-primary"
      >
        {t("myPageActivity")}
      </Text>

      <div className="border-border-subtle bg-background-subtle rounded-16 flex h-26.25 items-center border px-40 md:h-30">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-1 flex-col items-center text-center">
            <Text variant={{ base: "md-regular", md: "lg-regular" }} className="text-text-tertiary">
              {stat.label}
            </Text>
            <Text
              variant={{ base: "lg-bold", md: "xl-bold" }}
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

function ServiceSections({ profile }: { profile: MoverProfileMe }) {
  const t = useTranslations("profile");
  const tMoverSearch = useTranslations("moverSearch");
  return (
    <div className="flex w-full flex-col gap-24 md:gap-40">
      <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-types">
        <Text
          as="h2"
          id="mover-service-types"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          {t("moverServices")}
        </Text>
        <MoverOfferedServiceChips serviceTypes={profile.serviceTypes} />
      </section>

      <section className="flex flex-col gap-8 md:gap-16" aria-labelledby="mover-service-regions">
        <Text
          as="h2"
          id="mover-service-regions"
          variant={{ base: "lg-semibold", md: "xl-semibold" }}
          className="text-text-primary"
        >
          {t("moverRegions")}
        </Text>
        <div className="flex flex-wrap gap-8 md:gap-12">
          {profile.regions.map((region) => (
            <MoverServiceChip
              key={region.id}
              label={tMoverSearch(`regions.${region.id}`)}
              variant="region"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function MoverMyPageProfileSection({
  profile,
  favoriteCount,
  isFavoriteCountLoading,
}: MoverMyPageProfileSectionProps) {
  const t = useTranslations("profile");
  return (
    <>
      <div className="xl:flex xl:justify-between">
        <section
          className="flex w-full flex-col gap-16 md:gap-24 xl:w-205.25"
          aria-labelledby="mover-mypage-summary"
        >
          <div className="flex items-end gap-12">
            <ProfileImage
              src={profile.imageUrl ?? ""}
              width={80}
              height={85}
              preload
              className="bg-background-avatar rounded-12 md:rounded-20 h-16 w-15 object-contain md:h-21.25 md:w-20"
            />

            <div className="flex min-w-0 flex-col justify-end md:gap-8">
              <div className="flex items-center gap-4">
                <DriverBadgeIcon className="text-icon-brand size-20 shrink-0 md:size-28" />
                <Text
                  as="h2"
                  id="mover-mypage-summary"
                  variant={{ base: "lg-semibold", md: "2xl-semibold" }}
                  className="text-text-tertiary whitespace-nowrap"
                >
                  {profile.nickname}
                </Text>
              </div>

              <div className="flex items-center gap-4">
                <LikeIcon isFavorite className="text-like-active-fill size-24 shrink-0" />
                {isFavoriteCountLoading ? (
                  <div className="bg-background-subtle rounded-100 h-18 w-56 animate-pulse" />
                ) : (
                  <Text
                    as="p"
                    variant={{ base: "md-medium", md: "lg-medium" }}
                    className="text-text-muted whitespace-nowrap"
                  >
                    {favoriteCount.toLocaleString()}
                  </Text>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <Text
              as="p"
              variant="2lg-semibold"
              className="text-text-tertiary break-words whitespace-pre-wrap"
            >
              <AutoTranslatedText text={profile.shortIntro} />
            </Text>
            <Text
              as="p"
              variant={{ base: "md-regular", md: "lg-regular" }}
              className="text-text-muted break-words whitespace-pre-wrap"
            >
              <AutoTranslatedText text={profile.description} />
            </Text>
          </div>

          <div className="xl:hidden">
            <MoverMyPageEditActions />
          </div>
        </section>

        <aside
          className="hidden xl:block xl:w-70.75 xl:pt-72"
          aria-label={t("myPageProfileEditAria")}
        >
          <MoverMyPageEditActions desktop />
        </aside>
      </div>

      <div className="mt-24 flex w-full flex-col gap-24 md:mt-32 md:gap-40 xl:mt-32 xl:w-205.25">
        <div className="border-border-subtle w-full border-t" aria-hidden="true" />
        <ActivitySummary profile={profile} />
        <ServiceSections profile={profile} />
        <div className="border-border-subtle w-full border-t" aria-hidden="true" />
      </div>
    </>
  );
}
