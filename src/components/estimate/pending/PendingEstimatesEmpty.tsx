import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Text } from "@/components/common/Text";

// 2026.07.25 정슬기 - [추가] Figma 대기 목록 empty (견적 미도착)
export default async function PendingEstimatesEmpty() {
  const t = await getTranslations("estimates");
  return (
    <div
      className="px-margin-mobile md:px-margin-tablet flex w-full flex-col items-center justify-center gap-24 py-64 md:gap-32 md:py-80 xl:px-0"
      role="status"
    >
      <div className="relative size-200 opacity-30 md:size-280">
        <Image
          src="/images/empty-moving-car.png"
          alt=""
          fill
          sizes="(max-width: 743px) 200px, 280px"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col items-center text-center">
        <Text as="p" variant="lg-regular" className="text-text-muted md:hidden">
          {t("pendingEmptyLine1")}
        </Text>
        <Text as="p" variant="lg-regular" className="text-text-muted md:hidden">
          {t("pendingEmptyLine2")}
        </Text>
        <Text as="p" variant="2xl-regular" className="text-text-muted hidden md:block">
          {t("pendingEmptyLine1")}
        </Text>
        <Text as="p" variant="2xl-regular" className="text-text-muted hidden md:block">
          {t("pendingEmptyLine2")}
        </Text>
      </div>
    </div>
  );
}
