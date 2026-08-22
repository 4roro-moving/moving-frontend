"use client";
import Link from "next/link";

import { Text } from "@/components/common/Text";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { PageHeader } from "@/components/common/PageHeader";
import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ProfileEmptyState from "@/components/profile/ProfileEmptyState";
import { useMoverAuthReady } from "@/hooks/useMoverAuthReady";
import { useMoverDetail } from "@/hooks/useMoverDetail";
import { useMoverProfileMe } from "@/hooks/profile/useMoverProfileMe";
import { getRoleHomePath } from "@/lib/auth/redirect";
import type { MoverProfileMe } from "@/types/profile";

import MoverMyPageBanner from "./MoverMyPageBanner";
import {
  MoverMyPageActivity,
  MoverMyPageRegions,
  MoverMyPageServices,
} from "./MoverMyPageInfoSections";
import MoverMyPageProfileSummary from "./MoverMyPageProfileSummary";
import MoverMyPageReviews, { MoverMyPageReviewsSkeleton } from "./MoverMyPageReviews";

interface MoverMyPageContentProps {
  profile: MoverProfileMe;
}

function MoverMyPageContent({ profile }: MoverMyPageContentProps) {
  const { detail, isInitialLoading, query } = useMoverDetail(profile.userId);

  return (
    <>
      <MoverMyPageBanner />

      <main className="px-mypage-mobile-padding md:px-margin-tablet md:pt-mypage-content-top-tablet xl:pt-mypage-content-top-desktop w-full pt-23 pb-56 md:pb-72 xl:px-0 xl:pb-120">
        <div className="xl:max-w-desktop mx-auto flex w-full flex-col gap-24 md:gap-40">
          <div className="flex w-full flex-col gap-24 md:gap-32">
            <MoverMyPageProfileSummary
              profile={profile}
              favoriteCount={detail?.favoriteCount ?? 0}
              isFavoriteCountLoading={isInitialLoading}
            />
            <div
              className="border-border-subtle xl:w-mypage-content-width w-full border-t"
              aria-hidden="true"
            />
            <div className="xl:w-mypage-content-width">
              <MoverMyPageActivity profile={profile} />
            </div>
          </div>

          <div className="xl:w-mypage-content-width">
            <MoverMyPageServices profile={profile} />
          </div>

          <div className="xl:w-mypage-content-width">
            <MoverMyPageRegions profile={profile} />
          </div>

          <div
            className="border-border-subtle xl:w-mypage-content-width w-full border-t"
            aria-hidden="true"
          />

          <div className="xl:w-mypage-content-width w-full">
            {isInitialLoading ? (
              <MoverMyPageReviewsSkeleton />
            ) : detail ? (
              <MoverMyPageReviews
                moverId={profile.userId}
                rating={profile.averageRating ?? detail.rating}
                reviewCount={profile.reviewCount ?? detail.reviewCount}
                ratingDistribution={detail.ratingDistribution}
              />
            ) : (
              <section aria-labelledby="mover-reviews">
                <EstimatesQueryStatus
                  message="리뷰 정보를 불러오지 못했습니다."
                  actionLabel="다시 시도"
                  onAction={() => {
                    void query.refetch();
                  }}
                  actionBusy={query.isFetching}
                />
              </section>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export function MoverMyPageSkeleton() {
  return (
    <div className="bg-background-default flex w-full flex-col overflow-x-hidden">
      <PageHeader title="마이페이지" />
      <MoverMyPageBanner />

      <div className="px-mypage-mobile-padding md:px-margin-tablet md:pt-mypage-content-top-tablet xl:pt-mypage-content-top-desktop w-full pt-23 pb-56 md:pb-72 xl:px-0 xl:pb-120">
        <div className="xl:max-w-desktop mx-auto flex w-full flex-col gap-24 md:gap-40">
          <div className="xl:w-mypage-content-width">
            <div className="flex flex-col gap-16">
              <div className="flex items-start gap-12">
                <div className="bg-background-subtle rounded-12 md:h-mypage-profile-height md:rounded-20 h-64 w-60 animate-pulse md:w-80" />
                <div className="flex flex-col gap-8">
                  <div className="bg-background-subtle rounded-100 h-26 w-80 animate-pulse md:h-32 md:w-96" />
                  <div className="bg-background-subtle rounded-100 h-24 w-52 animate-pulse" />
                </div>
              </div>
              <div className="bg-background-subtle rounded-100 h-26 w-2/3 animate-pulse" />
              <div className="bg-background-subtle rounded-16 h-96 w-full animate-pulse" />
            </div>

            <div className="border-border-subtle my-24 w-full border-t md:my-32" />
            <div className="bg-background-subtle h-mypage-activity-mobile rounded-16 w-full animate-pulse md:h-120" />
          </div>

          <div className="border-border-subtle xl:w-mypage-content-width w-full border-t" />
          <div className="xl:w-mypage-content-width">
            <MoverMyPageReviewsSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MoverMyPageView() {
  const { canFetch, isPending: isAuthPending, user } = useMoverAuthReady();
  const canLoadProfile = canFetch && Boolean(user?.id);
  const { data: moverProfile, isPending: isProfilePending, isError } = useMoverProfileMe(canFetch);

  if (isAuthPending || (canLoadProfile && isProfilePending)) {
    return <MoverMyPageSkeleton />;
  }

  if (!canLoadProfile) {
    return null;
  }

  if (isError || !moverProfile) {
    return (
      <div className="bg-background-default flex w-full flex-col overflow-x-hidden">
        <PageHeader title="마이페이지" />
        <MoverMyPageBanner />
        <div className="px-mypage-mobile-padding md:px-margin-tablet flex w-full justify-center py-40 xl:px-0">
          <div className="xl:w-mypage-content-width w-full">
            <ProfileEmptyState
              description="기사님 프로필 정보를 불러오지 못했습니다."
              href={getRoleHomePath(user?.role)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-default flex w-full flex-col overflow-x-hidden">
      <PageHeader title="마이페이지" />
      <MoverMyPageContent profile={moverProfile} />
    </div>
  );
}
