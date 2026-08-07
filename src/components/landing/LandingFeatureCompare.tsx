import Image from "next/image";

import { Text } from "@/components/common/Text";

/**
 * 랜딩 견적 비교 소개 — DS img4 (lg / md / sm)
 * Figma Landing Desktop Frame 2610809 (1:6567): 1920×1081
 *   - img instance 1:6568 + text 1:6569 (417, 153.33) 32/42 Bold #262524
 * Figma DS: 1:12149 / 1:12151 / 720:41204
 * // 2026.08.01 정슬기 - [수정] aspect-ratio + % 좌표로 이미지·텍스트 동기화
 * // 2026.08.01 정슬기 - [수정] img4 투명→회색 bake 제거·full-bleed·object-cover 정렬
 * // 2026.08.02 정슬기 - [수정] Desktop 랜딩 인스턴스 에셋 + cqw 텍스트 스케일(줄바꿈·위치 맞춤)
 * // 2026.08.02 정슬기 - [수정] img4 Figma 원본 재적용(가공 번짐 제거, 캔버스만 밝게)
 */
export default function LandingFeatureCompare() {
  return (
    <>
      {/* Desktop — 1920×1081, text (417,153.33) 32px/42lh nowrap */}
      <section className="bg-background-default relative hidden w-full shrink-0 overflow-hidden xl:block">
        <div className="@container relative mx-auto aspect-[1920/1081] w-full max-w-[1920px]">
          <Image
            src="/images/landing/img4-lg.png"
            alt="여러 업체의 견적 카드 비교 예시"
            fill
            draggable={false}
            className="pointer-events-none select-none object-cover object-top"
            sizes="(min-width: 1280px) 1920px, 100vw"
          />
          <h2 className="text-text-secondary absolute top-[14.18%] left-[21.72%] z-10 text-[length:calc(32/1920*100cqw)] leading-[calc(42/1920*100cqw)] font-bold whitespace-nowrap">
            여러 업체의 견적을
            <br />
            한눈에 비교하고 선택해요
          </h2>
        </div>
      </section>

      {/* Tablet — 744×1008, full bleed */}
      <section className="bg-background-default relative hidden w-full shrink-0 overflow-hidden md:block xl:hidden">
        <div className="@container relative aspect-[744/1008] w-full">
          <Image
            src="/images/landing/img4-md.png"
            alt="여러 업체의 견적 카드 비교 예시"
            fill
            draggable={false}
            className="pointer-events-none select-none object-cover object-top"
            sizes="100vw"
          />
          <h2 className="text-text-secondary absolute top-[5.6%] left-[4.3%] z-10 text-[length:calc(32/744*100cqw)] leading-[calc(42/744*100cqw)] font-bold whitespace-nowrap">
            여러 업체의 견적을
            <br />
            한눈에 비교하고 선택해요
          </h2>
        </div>
      </section>

      {/* Mobile — 375×1076, full bleed */}
      <section className="bg-background-default relative w-full shrink-0 overflow-hidden md:hidden">
        <div className="@container relative aspect-[375/1076] w-full">
          <Image
            src="/images/landing/img4-sm.png"
            alt="여러 업체의 견적 카드 비교 예시"
            fill
            draggable={false}
            className="pointer-events-none select-none object-cover object-top"
            sizes="100vw"
          />
          <Text
            as="h2"
            variant="xl-bold"
            className="text-text-secondary absolute top-[5.2%] left-[8.5%] z-10 w-[200px] max-w-[calc(100%-64px)] text-left"
          >
            여러 업체의 견적을
            <br />
            한눈에 비교하고 선택해요
          </Text>
        </div>
      </section>
    </>
  );
}
