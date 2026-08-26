import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const MOVE_TYPES = [
  {
    titleKey: "smallMoveTitle",
    descriptionKey: "smallMoveDescription",
    imageSrc: "/images/landing/move-type-small.png",
    imageClassName: "size-56 md:size-[99px]",
    featured: false,
  },
  {
    titleKey: "homeMoveTitle",
    descriptionKey: "homeMoveDescription",
    imageSrc: "/images/landing/move-type-home.png",
    imageClassName: "size-[97px] md:size-[156px]",
    featured: true,
  },
  {
    titleKey: "officeMoveTitle",
    descriptionKey: "officeMoveDescription",
    imageSrc: "/images/landing/move-type-office.png",
    imageClassName: "size-[62px] md:size-[99px]",
    featured: false,
  },
] as const;

/**
 * 랜딩 이사 유형 소개 — Desktop / Tablet / Mobile (시각 전용, 클릭 없음)
 * DS img2 아이콘 raw fill + HTML 카드
 * // 2026.07.31 정슬기 - [추가]
 * // 2026.08.01 정슬기 - [수정] 개별 고해상도 아이콘으로 복원
 * // 2026.08.01 정슬기 - [수정] Mobile 카드가 화면 너비를 채우도록 조정
 * // 2026.08.02 정슬기 - [수정] 카드 배경을 background-muted 토큰으로 교체
 */
export default async function LandingMoveTypes() {
  const t = await getTranslations("landing");

  return (
    <section className="bg-background-default w-full overflow-x-hidden pt-[53px] pb-[61px] md:pt-[69px] md:pb-[109px] xl:pt-[115px] xl:pb-[125px]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[34px] md:gap-40 md:px-32 xl:flex-row xl:items-center xl:justify-between xl:gap-48 xl:px-0">
        <Text
          as="h2"
          variant={{ base: "xl-bold", md: "3xl-bold" }}
          className="text-text-primary ml-32 w-full max-w-[183px] shrink-0 md:ml-0 md:max-w-[292px] md:text-[length:var(--font-size-32)] md:leading-[var(--line-height-46)]"
        >
          {t("moveTypesTitleLine1")}
          <br />
          {t("moveTypesTitleLine2")}
        </Text>

        <ul className="relative left-1/2 grid h-[162px] w-[399px] shrink-0 -translate-x-1/2 grid-cols-[112px_153px_112px] items-center gap-11 md:static md:flex md:h-auto md:w-full md:translate-x-0 md:justify-center md:gap-16 xl:w-auto xl:gap-24">
          {MOVE_TYPES.map((item) => (
            <li
              key={item.titleKey}
              className={cn(
                "flex min-w-0 flex-col items-center",
                item.featured
                  ? "shadow-estimate-card h-[162px] w-[153px] justify-center gap-4 rounded-[24px] border-[2.5px] border-orange-300 bg-white px-10 md:h-auto md:w-[245px] md:flex-none md:justify-start md:gap-8 md:rounded-[39px] md:border-4 md:px-22 md:py-23"
                  : "bg-background-muted h-[130px] w-[112px] justify-center gap-4 rounded-[20px] px-10 md:h-auto md:w-[200px] md:flex-none md:justify-start md:gap-8 md:rounded-[31px] md:px-26 md:pt-26 md:pb-30",
              )}
            >
              <Image
                src={item.imageSrc}
                alt=""
                width={item.featured ? 156 : 99}
                height={item.featured ? 156 : 99}
                draggable={false}
                className={cn(
                  "pointer-events-none max-w-none shrink-0 object-contain select-none",
                  item.imageClassName,
                )}
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <Text
                  as="p"
                  variant={item.featured ? "xl-bold" : "lg-bold"}
                  className={cn(
                    item.featured ? "text-text-brand" : "text-text-primary",
                    item.featured
                      ? "text-[12px] leading-[18px] md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)]"
                      : "text-[10px] leading-[13px] md:text-[length:var(--font-size-16)] md:leading-[var(--line-height-26)]",
                  )}
                >
                  {t(item.titleKey)}
                </Text>
                <Text
                  as="p"
                  variant="sm-medium"
                  className="text-text-muted text-[7px] leading-[11px] md:text-[length:var(--font-size-13)] md:leading-[var(--line-height-22)]"
                >
                  {t(item.descriptionKey)}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
