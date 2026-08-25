"use client";

import { Text } from "@/components/common/Text";
import { useLocale, useTranslations } from "next-intl";
import { MoverProfileImage } from "@/components/mover/MoverProfileImage";
import { DriverBadgeIcon, LikeIcon } from "@/icons";
import type { MoverProfileMe } from "@/types/profile";

import MoverMyPageEditActions from "./MoverMyPageEditActions";

interface MoverMyPageProfileSummaryProps {
  profile: MoverProfileMe;
  favoriteCount: number;
  isFavoriteCountLoading: boolean;
}

export default function MoverMyPageProfileSummary({
  profile,
  favoriteCount,
  isFavoriteCountLoading,
}: MoverMyPageProfileSummaryProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  return (
    <div className="xl:flex xl:justify-between">
      <section
        className="xl:w-mypage-content-width flex w-full flex-col gap-16"
        aria-labelledby="mover-mypage-summary"
      >
        <div className="flex items-end gap-12">
          <MoverProfileImage
            src={profile.imageUrl ?? ""}
            width={80}
            height={85}
            preload
            className="bg-background-avatar rounded-12 md:h-mypage-profile-height md:rounded-20 h-64 w-60 object-cover md:w-80"
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
                  {new Intl.NumberFormat(locale).format(favoriteCount)}
                </Text>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-28 md:gap-32 xl:gap-0">
          <div className="flex flex-col gap-12">
            <Text
              as="p"
              variant="2lg-semibold"
              className="text-text-tertiary break-words whitespace-pre-wrap"
            >
              {profile.shortIntro}
            </Text>
            <Text
              as="p"
              variant={{ base: "md-regular", md: "lg-regular" }}
              className="text-text-muted break-words whitespace-pre-wrap"
            >
              {profile.description}
            </Text>
          </div>

          <div className="xl:hidden">
            <MoverMyPageEditActions />
          </div>
        </div>
      </section>

      <aside
        className="xl:w-mypage-actions-width hidden xl:block xl:pt-72"
        aria-label={t("myPageProfileEditAria")}
      >
        <MoverMyPageEditActions desktop />
      </aside>
    </div>
  );
}
