import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";
import type { PricePredictionResponse } from "@/types/pricePrediction";

interface PricePredictionResultProps {
  prediction: PricePredictionResponse | null;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}

function formatPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

export default function PricePredictionResult({
  prediction,
  isPending,
  isError,
  error,
}: PricePredictionResultProps) {
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
              예상 견적을 계산하고 있어요
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              입력한 조건과 비슷한 견적 사례를 찾고 있습니다.
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
              예상 견적을 불러오지 못했어요
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              {error?.message || "잠시 후 다시 시도해주세요."}
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
              AI 예상
            </Text>
          </div>

          <div className="flex flex-col gap-8">
            <Text as="p" variant="lg-semibold" className="text-text-primary">
              이사 조건을 입력해주세요
            </Text>

            <Text as="p" variant="md-regular" className="text-text-subtle">
              입력한 조건과 비슷한 견적 사례를 분석해
              <br className="hidden lg:block" />
              예상 가격 범위를 알려드려요.
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
            AI 예상
          </Text>
        </div>

        <div className="flex flex-col gap-12">
          <Text as="h2" variant="xl-bold" className="text-text-primary">
            예상 견적
          </Text>

          <Text as="p" variant="3xl-bold" className="text-text-brand">
            약 {formatPrice(prediction.estimatedPrice)}
          </Text>

          <Text as="p" variant="md-medium" className="text-text-primary">
            예상 범위 {formatPrice(prediction.priceRange.min)}
            {" ~ "}
            {formatPrice(prediction.priceRange.max)}
          </Text>
        </div>

        <div className="bg-border-subtle h-px w-full" />

        <div className="flex flex-col gap-16">
          <div className="flex items-center justify-between">
            <Text as="span" variant="md-medium" className="text-text-subtle">
              참고한 유사 견적
            </Text>

            <Text as="span" variant="md-semibold" className="text-text-primary">
              {prediction.sampleCount}건
            </Text>
          </div>

          <div className="bg-background-subtle rounded-12 flex flex-col gap-8 p-16">
            <Text as="p" variant="md-semibold" className="text-text-primary">
              {getMoveTypeLabel(prediction.factors.moveType)}
            </Text>

            <Text as="p" variant="md-regular" className="text-text-secondary">
              {prediction.factors.route}
            </Text>

            <Text as="p" variant="xs-regular" className="text-text-subtle">
              {prediction.factors.distanceKm}km · {prediction.factors.houseSize}평 · 짐량{" "}
              {getLoadAmountLabel(prediction.factors.loadAmount)}
            </Text>

            <div className="flex flex-wrap gap-8 pt-4">
              <ConditionChip active={prediction.factors.isWeekend}>주말</ConditionChip>

              <ConditionChip active={prediction.factors.isPeakSeason}>성수기</ConditionChip>
            </div>
          </div>
        </div>

        <div className="rounded-12 bg-background-subtle p-16">
          <Text as="p" variant="xs-regular" className="text-text-subtle">
            예상 견적은 유사한 이사 사례를 바탕으로 계산한 참고 금액입니다. 실제 견적은 기사님, 날짜
            및 현장 조건에 따라 달라질 수 있어요.
          </Text>
        </div>
      </div>
    </ResultContainer>
  );
}

function ResultContainer({ children }: { children: React.ReactNode }) {
  return (
    <aside
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

function getMoveTypeLabel(moveType: PricePredictionResponse["factors"]["moveType"]) {
  switch (moveType) {
    case "SMALL":
      return "소형/원룸 이사";
    case "HOME":
      return "가정 이사";
    case "OFFICE":
      return "사무실 이사";
  }
}

function getLoadAmountLabel(loadAmount: PricePredictionResponse["factors"]["loadAmount"]) {
  switch (loadAmount) {
    case "LOW":
      return "적음";
    case "MEDIUM":
      return "보통";
    case "HIGH":
      return "많음";
  }
}
