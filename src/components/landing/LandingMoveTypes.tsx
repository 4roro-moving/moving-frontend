import Image from "next/image";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

const MOVE_TYPES = [
  {
    title: "소형이사",
    description: "원룸, 투룸, 20평대 미만",
    imageSrc: "/images/landing/move-type-small.png",
    imageClassName: "size-56 min-[744px]:size-[99px]",
    featured: false,
  },
  {
    title: "가정이사",
    description: "쓰리룸, 20평대 미만",
    imageSrc: "/images/landing/move-type-home.png",
    imageClassName: "size-[97px] min-[744px]:size-[156px]",
    featured: true,
  },
  {
    title: "기업, 사무실 이사",
    description: "사무실, 상업공간",
    imageSrc: "/images/landing/move-type-office.png",
    imageClassName: "size-[62px] min-[744px]:size-[99px]",
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
export default function LandingMoveTypes() {
  return (
    <section className="bg-background-default w-full overflow-x-hidden pt-[53px] pb-[61px] min-[744px]:pt-[69px] min-[744px]:pb-[109px] xl:pt-[115px] xl:pb-[125px]">
      <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[34px] min-[744px]:gap-40 min-[744px]:px-32 xl:flex-row xl:items-center xl:justify-between xl:gap-48 xl:px-0">
        <Text
          as="h2"
          variant={{ base: "xl-bold", md: "3xl-bold" }}
          className="text-text-primary w-full max-w-[183px] shrink-0 px-32 min-[744px]:max-w-[292px] min-[744px]:px-0 min-[744px]:text-[length:var(--font-size-32)] min-[744px]:leading-[var(--line-height-46)]"
        >
          번거로운 선정과정,
          <br />
          이사 유형부터 선택해요
        </Text>

        <ul className="flex w-full items-stretch justify-center gap-[9px] px-32 min-[744px]:items-center min-[744px]:gap-16 min-[744px]:px-0 xl:w-auto xl:gap-24">
          {MOVE_TYPES.map((item) => (
            <li
              key={item.title}
              className={cn(
                "flex min-w-0 flex-col items-center",
                item.featured
                  ? "shadow-estimate-card flex-[1.2] gap-4 rounded-[24px] border-[2.5px] border-orange-300 bg-white px-10 py-14 min-[744px]:w-[245px] min-[744px]:flex-none min-[744px]:gap-8 min-[744px]:rounded-[39px] min-[744px]:border-4 min-[744px]:px-22 min-[744px]:py-23"
                  : "bg-background-muted flex-1 gap-4 rounded-[20px] px-10 pt-16 pb-18 min-[744px]:w-[200px] min-[744px]:flex-none min-[744px]:gap-8 min-[744px]:rounded-[31px] min-[744px]:px-26 min-[744px]:pt-26 min-[744px]:pb-30",
              )}
            >
              <Image
                src={item.imageSrc}
                alt=""
                width={item.featured ? 156 : 99}
                height={item.featured ? 156 : 99}
                className={cn("object-contain", item.imageClassName)}
              />
              <div className="flex flex-col items-center gap-2 text-center">
                <Text
                  as="p"
                  variant={item.featured ? "xl-bold" : "lg-bold"}
                  className={cn(
                    item.featured ? "text-text-brand" : "text-text-primary",
                    item.featured
                      ? "text-[12px] leading-[18px] min-[744px]:text-[length:var(--font-size-20)] min-[744px]:leading-[var(--line-height-32)]"
                      : "text-[10px] leading-[13px] min-[744px]:text-[length:var(--font-size-16)] min-[744px]:leading-[var(--line-height-26)]",
                  )}
                >
                  {item.title}
                </Text>
                <Text
                  as="p"
                  variant="sm-medium"
                  className="text-text-muted text-[7px] leading-[11px] min-[744px]:text-[length:var(--font-size-13)] min-[744px]:leading-[var(--line-height-22)]"
                >
                  {item.description}
                </Text>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
