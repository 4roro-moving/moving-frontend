import { Text } from "@/components/common/Text";
import { formatPrice } from "@/lib/utils/estimateFormat";

interface EstimateDetailPriceProps {
  price: number;
}

export default async function EstimateDetailPrice({ price }: EstimateDetailPriceProps) {
  const t = await getTranslations("estimates");
  return (
    // 2026.07.24 정슬기 - [수정] Mobile/Tablet 견적가 justify-between, Desktop 간격 유지
    // 2026.07.25 정슬기 - [수정] Desktop 라벨↔금액 gap 61, 섹션 gap 36 (Figma 8091:48003)
    <section className="flex w-full flex-col gap-24 md:gap-36" aria-label={t("priceLabel")}>
      <div className="flex w-full items-center justify-between gap-16 md:justify-start md:gap-24 xl:gap-15.25">
        <h2 className="text-text-primary shrink-0">
          <Text as="span" variant="lg-semibold" className="md:hidden">
            {t("priceLabel")}
          </Text>
          <Text as="span" variant="xl-semibold" className="hidden md:inline">
            {t("priceLabel")}
          </Text>
        </h2>
        <p className="text-text-primary wrap-break-word">
          <Text as="span" variant="xl-bold" className="md:hidden">
            {formatPrice(price)}
          </Text>
          <Text as="span" variant="2xl-bold" className="hidden md:inline">
            {formatPrice(price)}
          </Text>
        </p>
      </div>
      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
import { getTranslations } from "next-intl/server";
