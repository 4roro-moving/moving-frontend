import { Text } from "@/components/common/Text";
import { formatPrice } from "@/lib/utils/estimateFormat";

interface EstimateDetailPriceProps {
  price: number;
}

export default function EstimateDetailPrice({ price }: EstimateDetailPriceProps) {
  return (
    <section className="flex w-full flex-col gap-36" aria-label="견적가">
      <div className="flex items-center gap-24 md:gap-[61px]">
        <Text as="h2" variant="xl-semibold" className="text-text-primary shrink-0">
          견적가
        </Text>
        <Text as="p" variant="2xl-bold" className="text-text-primary">
          {formatPrice(price)}
        </Text>
      </div>
      <div className="border-border-subtle w-full border-t" aria-hidden="true" />
    </section>
  );
}
