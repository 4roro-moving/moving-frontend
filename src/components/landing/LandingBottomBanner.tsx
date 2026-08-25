import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Text } from "@/components/common/Text";

/**
 * 랜딩 하단 브랜드 배너 — Desktop / Tablet / Mobile
 * // 2026.07.31 정슬기 - [추가]
 * // 2026.08.01 정슬기 - [수정] Design System app icon (Union SVG + white tile)
 * // 2026.08.02 정슬기 - [수정] 배너 그라디언트를 토큰/Tailwind 유틸로 교체
 */
export default async function LandingBottomBanner() {
  const t = await getTranslations("landing");

  return (
    <section className="bg-landing-bottom-banner flex w-full shrink-0 flex-col items-center pt-[39px] pb-[39px] md:pt-[65px] md:pb-[65px] xl:pt-[87px] xl:pb-[87px]">
      <div className="flex w-[363px] max-w-full flex-col items-center gap-12 md:gap-32">
        {/* Figma app icon lg: 100×103 white rounded tile + Union 58×60 */}
        <div className="flex size-[56px] shrink-0 items-center justify-center overflow-hidden rounded-[11px] bg-white md:size-[100px] md:rounded-[19px]">
          <Image
            src="/images/landing/brand-mark.svg"
            alt={t("brandAlt")}
            width={58}
            height={60}
            unoptimized
            draggable={false}
            className="pointer-events-none h-[34px] w-[33px] object-contain select-none md:h-[60px] md:w-[58px]"
          />
        </div>

        <Text
          as="p"
          variant={{ base: "lg-bold", md: "2xl-bold" }}
          className="text-text-inverse w-full text-center md:text-[28px] md:leading-[46px]"
        >
          <span className="md:hidden">
            {t("bottomBannerLine1")}
            <br />
            {t("bottomBannerLine2")}
          </span>
          <span className="hidden md:inline">{t("bottomBannerDesktop")}</span>
        </Text>
      </div>
    </section>
  );
}
