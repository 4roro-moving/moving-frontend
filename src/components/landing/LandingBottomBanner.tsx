import Image from "next/image";

import { Text } from "@/components/common/Text";

/**
 * 랜딩 하단 브랜드 배너 — Desktop / Tablet / Mobile
 * // 2026.07.31 정슬기 - [추가]
 * // 2026.08.01 정슬기 - [수정] Design System app icon (Union SVG + white tile)
 */
export default function LandingBottomBanner() {
  return (
    <section
      className="flex w-full shrink-0 flex-col items-center pt-[39px] pb-[39px] min-[744px]:pt-[65px] min-[744px]:pb-[65px] xl:pt-[87px] xl:pb-[87px]"
      style={{
        backgroundImage:
          "linear-gradient(91.71deg, rgb(249, 93, 46) 3.36%, rgb(249, 80, 46) 88.38%)",
      }}
    >
      <div className="flex w-[363px] max-w-full flex-col items-center gap-12 min-[744px]:gap-32">
        {/* Figma app icon lg: 100×103 white rounded tile + Union 58×60 */}
        <div className="flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-white min-[744px]:size-[100px] min-[744px]:rounded-[19px]">
          <Image
            src="/images/landing/brand-mark.svg"
            alt="무빙"
            width={58}
            height={60}
            unoptimized
            className="h-[34px] w-[33px] object-contain min-[744px]:h-[60px] min-[744px]:w-[58px]"
          />
        </div>

        <Text
          as="p"
          variant={{ base: "lg-bold", md: "2xl-bold" }}
          className="text-text-inverse w-full text-center min-[744px]:text-[28px] min-[744px]:leading-[46px]"
        >
          <span className="min-[744px]:hidden">
            복잡한 이사 준비,
            <br />
            무빙 하나면 끝!
          </span>
          <span className="hidden min-[744px]:inline">복잡한 이사 준비, 무빙 하나면 끝!</span>
        </Text>
      </div>
    </section>
  );
}
