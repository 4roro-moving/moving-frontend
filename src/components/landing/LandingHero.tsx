import Image from "next/image";

import { Text } from "@/components/common/Text";

/**
 * 랜딩 Hero — Desktop / Tablet / Mobile
 * 배경(hero-bg) + 트럭(hero-truck) 분리 + HTML 카피 (원래 형태)
 * // 2026.07.31 정슬기 - [추가]
 * // 2026.08.01 정슬기 - [수정] Tablet/Mobile 반응형
 * // 2026.08.01 정슬기 - [수정] Hero 이미지를 배경+트럭 원본 형태로 복원
 * // 2026.08.02 정슬기 - [수정] 오버레이 그라디언트를 토큰/Tailwind 유틸로 교체
 */
export default function LandingHero() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative flex h-[313px] w-full items-center justify-center md:h-[405px]">
        <Image
          src="/images/landing/hero-bg.jpg"
          alt=""
          fill
          priority
          draggable={false}
          className="pointer-events-none object-cover object-bottom opacity-80 select-none"
          sizes="100vw"
        />
        <div aria-hidden className="bg-landing-hero-overlay absolute inset-0" />

        <div className="relative z-10 flex flex-col items-center gap-20 px-32 text-center min-[375px]:px-56 md:gap-28 md:px-24">
          <Image
            src="/images/landing/hero-truck.svg"
            alt=""
            width={160}
            height={99}
            draggable={false}
            className="pointer-events-none h-[62px] w-[100px] object-contain select-none md:h-[99px] md:w-160"
            unoptimized
          />

          <div className="flex w-full max-w-[327px] flex-col items-center gap-8 md:max-w-[431px] md:gap-16">
            <Text
              as="h1"
              variant={{ base: "xl-bold", md: "3xl-bold" }}
              className="text-text-inverse md:text-[length:var(--font-size-32)] md:leading-[var(--line-height-46)]"
            >
              이사업체, 어떻게 고르세요?
            </Text>
            <Text
              as="p"
              variant={{ base: "lg-regular", md: "2lg-regular" }}
              className="whitespace-nowrap text-gray-300 md:text-[length:var(--font-size-18)] md:leading-[var(--line-height-26)] md:text-gray-200"
            >
              무빙은 여러 견적을 한눈에 비교해
              <br />
              이사업체 선정 과정을 간편하게 바꿔드려요
            </Text>
          </div>
        </div>
      </div>
    </section>
  );
}
