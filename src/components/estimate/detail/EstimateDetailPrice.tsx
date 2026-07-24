import { Text } from "@/components/common/Text";
import { formatPrice } from "@/lib/utils/estimateFormat";

interface EstimateDetailPriceProps {
  price: number;
}

export default function EstimateDetailPrice({ price }: EstimateDetailPriceProps) {
  return (
    // 2026.07.24 정슬기 - [수정] Mobile/Tablet 견적가 justify-between, Desktop 간격 유지
    <section className="flex w-full flex-col gap-24 md:gap-36" aria-label="견적가">
      <div className="flex w-full items-center justify-between gap-16 md:justify-start md:gap-24 lg:gap-[61px]">
        <Text
          as="h2"
          variant="lg-semibold"
          className="text-text-primary shrink-0 md:text-[length:var(--font-size-20)] md:leading-[var(--line-height-32)]"
        >
          견적가
        </Text>
        <Text
          as="p"
          variant="xl-bold"
          className="text-text-primary break-words md:text-[length:var(--font-size-24)] md:leading-[var(--line-height-32)]"
        >
          {formatPrice(price)}
        </Text>
      </div>
      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
