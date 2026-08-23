"use client";

import { HeroDecorationLeftIcon, HeroDecorationRightIcon } from "@/icons";

export default function MoverMyPageBanner() {
  return (
    <div className="bg-background-brand h-mypage-hero-mobile md:h-mypage-hero-tablet xl:h-mypage-hero-desktop relative w-full overflow-hidden">
      <div className="xl:max-w-desktop relative mx-auto h-full w-full">
        <HeroDecorationLeftIcon className="text-icon-brand-tertiary top-mypage-deco-left-mobile-y -left-mypage-deco-left-mobile-x h-mypage-deco-left-mobile-h w-mypage-deco-left-mobile-w md:top-mypage-deco-left-tablet-y md:-left-mypage-deco-left-tablet-x md:h-mypage-deco-left-large-h md:w-mypage-deco-left-large-w xl:top-mypage-deco-left-desktop-y xl:-left-mypage-deco-left-desktop-x absolute" />
        <HeroDecorationRightIcon className="text-icon-brand-tertiary top-mypage-deco-right-mobile-y right-mypage-deco-right-mobile-x h-mypage-deco-right-mobile-h w-mypage-deco-right-mobile-w md:top-mypage-deco-right-tablet-y md:right-mypage-deco-right-tablet-x md:h-mypage-deco-right-large-h md:w-mypage-deco-right-large-w xl:top-mypage-deco-right-desktop-y xl:right-mypage-deco-right-desktop-x absolute" />
      </div>
    </div>
  );
}
