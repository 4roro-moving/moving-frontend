import { useFormatter, useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import type { PricePredictionResponse } from "@/types/pricePrediction";

interface PricePredictionResultProps {
  prediction: PricePredictionResponse | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

export default function PricePredictionResult({
  prediction,
  isPending,
  isError,
  error,
}: PricePredictionResultProps) {
  const t = useTranslations("pricePrediction");
  const format = useFormatter();
  const formatPrice = (price: number) =>
    format.number(price, { style: "currency", currency: "KRW", maximumFractionDigits: 0 });
  if (isPending) {
    return (
      <ResultContainer>
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-16">
          <div
            className={cn(
              "size-36 rounded-full border-4",
              "border-border-subtle border-t-border-brand",
              "animate-spin",
            )}
            aria-hidden
          />

          <div className="flex flex-col items-center gap-8 text-center">
            <Text as="p" variant="lg-semibold" className="text-text-primary">
              {t("result.calculatingTitle")}
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              {t("result.calculatingDescription")}
            </Text>
          </div>
        </div>
      </ResultContainer>
    );
  }

  if (isError) {
    return (
      <ResultContainer>
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-20 px-12 text-center">
          <div className="bg-background-error-muted flex size-48 items-center justify-center rounded-full">
            <Text as="span" variant="lg-bold" className="text-text-error">
              !
            </Text>
          </div>

          <div className="flex flex-col gap-8">
            <Text as="p" variant="lg-semibold" className="text-text-primary">
              {t("result.errorTitle")}
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              {error?.message || t("result.errorFallback")}
            </Text>
          </div>
        </div>
      </ResultContainer>
    );
  }

  if (!prediction) {
    return (
      <ResultContainer>
        <div className="flex min-h-[360px] flex-col items-center justify-center gap-16 px-12 text-center">
          <div className="bg-background-brand-muted flex h-32 items-center rounded-full px-16">
            <Text as="span" variant="sm-semibold" className="text-text-brand">
              {t("result.aiBadge")}
            </Text>
          </div>

          <div className="flex flex-col gap-8">
            <Text as="p" variant="lg-semibold" className="text-text-primary">
              {t("result.emptyTitle")}
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              {t("result.emptyDescription")}
            </Text>
          </div>
        </div>
      </ResultContainer>
    );
  }

  return (
    <ResultContainer>
      <div className="flex flex-col gap-28">
        <div className="bg-background-brand-muted flex h-32 w-fit items-center rounded-full px-16">
          <Text as="span" variant="sm-semibold" className="text-text-brand">
            {t("result.aiBadge")}
          </Text>
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-bold" className="text-text-primary">
            {t("result.title")}
          </Text>

          <Text as="p" variant="3xl-bold" className="text-text-brand">
            {t("result.estimatedPrice", { price: formatPrice(prediction.estimatedPrice) })}
          </Text>

          <Text as="p" variant="md-medium" className="text-text-primary">
            {t("result.priceRange", {
              min: formatPrice(prediction.priceRange.min),
              max: formatPrice(prediction.priceRange.max),
            })}
          </Text>
        </div>

        <div className="bg-border-subtle h-px w-full" />

        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-between">
            <Text as="span" variant="md-medium" className="text-text-subtle">
              {t("result.sampleLabel")}
            </Text>

            <Text as="span" variant="md-semibold" className="text-text-primary">
              {t("result.sampleCount", { count: prediction.sampleCount })}
            </Text>
          </div>

          <div className="bg-background-subtle rounded-12 flex flex-col gap-8 p-16">
            <Text as="p" variant="md-semibold" className="text-text-primary">
              {t(`moveTypes.${prediction.factors.moveType}`)}
            </Text>

            <Text as="p" variant="md-regular" className="text-text-secondary">
              {prediction.factors.route}
            </Text>

            <Text as="p" variant="xs-regular" className="text-text-subtle">
              {t("result.factorSummary", {
                distance: prediction.factors.distanceKm,
                size: prediction.factors.houseSize,
                load: t(`loadAmounts.${prediction.factors.loadAmount}`),
              })}
            </Text>

            <div className="flex flex-wrap gap-8 pt-4">
              <ConditionChip active={prediction.factors.isWeekend}>
                {t("result.weekend")}
              </ConditionChip>

              <ConditionChip active={prediction.factors.isPeakSeason}>
                {t("result.peakSeason")}
              </ConditionChip>
            </div>
          </div>
        </div>

        <div className="rounded-12 bg-background-subtle p-16">
          <Text as="p" variant="xs-regular" className="text-text-subtle">
            {t("result.disclaimer")}
          </Text>
        </div>
      </div>
    </ResultContainer>
  );
}

function ResultContainer({ children }: { children: React.ReactNode }) {
  return (
    <aside
      role="status"
      aria-live="polite"
      className={cn(
        "rounded-16 border-border-default w-full border bg-white p-24 md:p-32",
        "lg:sticky lg:top-32 lg:self-start",
      )}
    >
      {children}
    </aside>
  );
}

function ConditionChip({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full px-12 py-6",
        active ? "bg-background-brand-muted" : "bg-background-muted",
      )}
    >
      <Text
        as="span"
        variant="xs-medium"
        className={active ? "text-text-brand" : "text-text-subtle"}
      >
        {children}
      </Text>
    </span>
  );
}
