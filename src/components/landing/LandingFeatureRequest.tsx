import Image from "next/image";

import { Text } from "@/components/common/Text";

/**
 * 랜딩 견적 요청 소개 — DS img3 (lg / md / sm)
 * Figma: 1:12143 / 1:12145 / 1:12147
 * Mobile/Tablet: img rect가 프레임보다 넓고 좌측으로 밀려 있음 → overflow clip으로 검정 여백 제거
 * // 2026.08.01 정슬기 - [수정] img3_sm/md Figma inset 크롭 반영 (양옆 검정 여백 제거)
 * // 2026.08.03 정슬기 - [수정] 기본값과 동일한 priority={false} 제거
 */
export default function LandingFeatureRequest() {
  return (
    <>
      {/* Desktop — 1402×787, rect 정렬됨, text (752,152) */}
      <section className="bg-background-default hidden w-full px-40 pb-[61px] xl:block">
        <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[80px]">
          <div className="relative aspect-[1402/787] w-full">
            <Image
              src="/images/landing/img3-lg.png"
              alt="견적 상세 화면 예시"
              fill
              className="object-cover object-left-top"
              sizes="(min-width: 1280px) 1400px, 100vw"
            />
            <Text
              as="h2"
              variant="3xl-bold"
              className="text-text-inverse absolute top-[19.3%] left-[53.7%] z-10 w-[27.3%] max-w-[382px] text-left"
            >
              원하는 이사 서비스를 요청하고
              <br />
              견적을 받아보세요
            </Text>
          </div>
        </div>
      </section>

      {/* Tablet — frame 679×835, rect 783×835 @ x=-66 → inset left -9.72% right -5.6% */}
      <section className="bg-background-default relative hidden w-full overflow-x-hidden pb-36 md:block xl:hidden">
        <div className="relative mx-auto w-full max-w-[744px] overflow-hidden">
          <div className="relative aspect-[679/835] w-full overflow-hidden">
            <div className="absolute inset-[0_-5.6%_0_-9.72%]">
              <Image
                src="/images/landing/img3-md.png"
                alt="견적 상세 화면 예시"
                fill
                className="object-cover object-top"
                sizes="100vw"
              />
            </div>
            <Text
              as="h2"
              variant="3xl-bold"
              className="text-text-inverse absolute top-[5.9%] right-[8%] left-auto z-10 w-[56%] max-w-[382px] text-right"
            >
              원하는 이사 서비스를 요청하고
              <br />
              견적을 받아보세요
            </Text>
          </div>
        </div>
      </section>

      {/* Mobile — frame 375×496, rect 439×495 @ x=-52 → inset left -13.84% right -3.41% */}
      <section className="relative w-full overflow-x-hidden pb-16 md:hidden">
        <div className="relative aspect-[375/496] w-full overflow-hidden">
          <div className="absolute inset-[0_-3.41%_0.1%_-13.84%]">
            <Image
              src="/images/landing/img3-sm.png"
              alt="견적 상세 화면 예시"
              fill
              className="object-cover object-top"
              sizes="100vw"
            />
          </div>
          <Text
            as="h2"
            variant="xl-bold"
            className="text-text-inverse absolute top-[5.8%] right-[8.5%] left-auto z-10 w-[239px] max-w-[calc(100%-64px)] text-right"
          >
            원하는 이사 서비스를 요청하고
            <br />
            견적을 받아보세요
          </Text>
        </div>
      </section>
    </>
  );
}
