import Image from "next/image";

import { ProfileDefaultIcon } from "@/icons";

interface EstimateDetailHeroProps {
  imageUrl: string | null;
  name: string;
}

export default function EstimateDetailHero({ imageUrl, name }: EstimateDetailHeroProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 히어로·아바타 크기, Desktop(lg) 기존 유지
    <div className="relative h-[160px] w-full shrink-0 md:h-[200px] lg:h-[259px]">
      <div className="bg-background-brand absolute top-0 left-1/2 h-[122px] w-full max-w-[1920px] -translate-x-1/2 overflow-hidden md:h-[170px] lg:h-[225px]">
        <div
          className="bg-icon-brand-tertiary pointer-events-none absolute top-1/2 left-[calc(50%+314px)] hidden size-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 lg:block"
          aria-hidden="true"
        />
        <div
          className="bg-icon-brand-tertiary pointer-events-none absolute top-1/2 left-[calc(50%-665px)] hidden size-120 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 lg:block"
          aria-hidden="true"
        />
      </div>

      {/* 2026.07.24 정슬기 - [수정] margin 토큰 유틸(left-margin-*) 사용 */}
      <div className="rounded-16 md:rounded-20 left-margin-mobile md:left-margin-tablet absolute bottom-0 size-[86px] overflow-hidden md:size-[96px] lg:top-[122px] lg:bottom-auto lg:left-[max(1rem,calc(50%-600px))] lg:h-[137px] lg:w-[129px]">
        <div className="relative size-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${name} 기사님 프로필`}
              fill
              sizes="(max-width: 768px) 86px, (max-width: 1024px) 96px, 129px"
              className="object-cover"
            />
          ) : (
            <ProfileDefaultIcon className="size-full" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}
