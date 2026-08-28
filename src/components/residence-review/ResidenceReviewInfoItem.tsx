import { Text, type TextVariantProp } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ResidenceReviewInfoItemProps {
  label: string;
  value: string;
  labelVariant?: TextVariantProp;
  valueVariant?: TextVariantProp;
  className?: string;
}

const ResidenceReviewInfoItem = ({
  label,
  value,
  labelVariant = { base: "xs-medium", md: "md-regular" },
  valueVariant = { base: "sm-medium", md: "lg-regular" },
  className,
}: ResidenceReviewInfoItemProps) => {
  return (
    <div className={cn("flex min-w-0 flex-col items-start gap-4", className)}>
      <Text as="dt" variant={labelVariant} className="text-text-muted">
        {label}
      </Text>
      <Text as="dd" variant={valueVariant} className="text-text-secondary m-0">
        {value}
      </Text>
    </div>
  );
};

export default ResidenceReviewInfoItem;
