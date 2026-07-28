import Image from "next/image";

import { HeroDecorationLeftIcon, HeroDecorationRightIcon, ProfileDefaultIcon } from "@/icons";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";

interface EstimateDetailHeroProps {
  imageUrl: string | null;
  name: string;
}

export default function EstimateDetailHero({ imageUrl, name }: EstimateDetailHeroProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Figma Mobile/Tablet 히어로·아바타 크기, Desktop(lg) 기존 유지
    // 2026.07.25 정슬기 - [수정] 임의 px 클래스를 spacing 토큰 유틸로 교체
    <div className="relative h-160 w-full shrink-0 md:h-200 lg:h-64.75">
      <div className="bg-background-brand absolute top-0 left-1/2 h-30.5 w-full max-w-480 -translate-x-1/2 overflow-hidden md:h-42.5 lg:h-56.25">
        {/* 2026.07.25 정슬기 - [수정] Figma hero-decoration SVG(캡슐 벡터)로 원형 CSS 대체 */}
        {/* 우측: AABB x=1112(50%+152), 주황 배너 하단에 맞춤 */}
        {/* 2026.07.26 정슬기 - [수정] Tailwind arbitrary calc 연산자 공백을 _로 표기 */}
        <HeroDecorationRightIcon className="text-icon-brand-tertiary pointer-events-none absolute bottom-0 left-[calc(50%_+_152px)] hidden h-37 w-81.25 lg:block" />
        <HeroDecorationLeftIcon className="text-icon-brand-tertiary pointer-events-none absolute top-[79.39px] left-[calc(50%_-_750px)] hidden h-28.75 w-42.5 lg:block" />
      </div>

      {/* 2026.07.24 정슬기 - [수정] margin 토큰 유틸(left-margin-*) 사용 */}
      {/* 2026.07.25 정슬기 - [수정] Desktop 아바타 x=359 (Figma 8091:47378), 129×137, r20, top=122 */}
      {/* 2026.07.26 정슬기 - [수정] Tablet 프로필 Figma 100×100·r12 (1:9171 / 1:11975) — size-25 */}
      {/* 프로필은 Figma처럼 둥근 네모(원형 X). 기본 아이콘도 사각 배경으로 맞춤 */}
      <div className="bg-background-avatar rounded-16 md:rounded-12 left-margin-mobile md:left-margin-tablet lg:rounded-20 absolute bottom-0 size-21.5 overflow-hidden md:size-25 lg:top-30.5 lg:bottom-auto lg:left-[max(1rem,calc(50%_-_601px))] lg:h-34.25 lg:w-32.25">
        <div className="relative size-full">
          {imageUrl ? (
            <Image
              src={resolveMoverProfileImageSrc(imageUrl)}
              alt={`${name} 기사님 프로필`}
              fill
              sizes="(max-width: 768px) 86px, (max-width: 1024px) 100px, 129px"
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
