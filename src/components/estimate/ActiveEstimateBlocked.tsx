"use client";

import Image from "next/image";
import Link from "next/link";

import { Text } from "@/components/common/Text";

/** 받은 견적 목록 화면이 준비되면 경로만 교체 */
const RECEIVED_ESTIMATES_HREF = "/my-estimates";

export default function ActiveEstimateBlocked() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center px-24 py-64 md:min-h-[70vh]">
      <div className="flex flex-col items-center gap-24 md:gap-32">
        <div className="relative size-[180px] opacity-30 md:size-[280px]">
          <Image
            src="/images/empty/moving-car.png"
            alt=""
            fill
            sizes="(max-width: 768px) 180px, 280px"
            className="object-contain"
            priority
          />
        </div>

        <Text as="p" variant="lg-regular" className="text-text-muted text-center md:hidden">
          현재 진행 중인 이사 견적이 있어요!
          <br />
          진행 중인 이사 완료 후 새로운 견적을 받아보세요.
        </Text>
        <Text as="p" variant="2xl-regular" className="text-text-muted hidden text-center md:block">
          현재 진행 중인 이사 견적이 있어요!
          <br />
          진행 중인 이사 완료 후 새로운 견적을 받아보세요.
        </Text>

        <Link
          href={RECEIVED_ESTIMATES_HREF}
          className="bg-background-brand hover:bg-background-brand-hover rounded-12 md:rounded-16 flex h-[54px] items-center justify-center px-16 transition-colors md:h-64"
        >
          <Text as="span" variant="lg-semibold" className="text-text-inverse md:hidden">
            받은 견적 보러가기
          </Text>
          <Text as="span" variant="2lg-semibold" className="text-text-inverse hidden md:inline">
            받은 견적 보러가기
          </Text>
        </Link>
      </div>
    </div>
  );
}
