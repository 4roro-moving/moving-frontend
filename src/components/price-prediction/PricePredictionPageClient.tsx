"use client";

import { useState } from "react";

import { Text } from "@/components/common/Text";
import { usePricePrediction } from "@/hooks/usePricePrediction";
import type { PricePredictionRequest, PricePredictionResponse } from "@/types/pricePrediction";

import PricePredictionForm from "./PricePredictionForm";
import PricePredictionResult from "./PricePredictionResult";

export default function PricePredictionPageClient() {
  const [prediction, setPrediction] = useState<PricePredictionResponse | null>(null);

  const { mutate: predictPrice, isPending, isError, error, reset } = usePricePrediction();

  const handleSubmit = (data: PricePredictionRequest) => {
    reset();

    predictPrice(data, {
      onSuccess: (result) => {
        setPrediction(result);
      },
    });
  };

  return (
    <div className="max-w-container-desktop mx-auto flex w-full flex-col gap-40">
      <div className="flex flex-col items-center gap-8 text-center">
        <Text as="h1" variant="2xl-bold" className="text-text-primary">
          AI로 미리 예상 견적을 확인해보세요
        </Text>

        <Text as="p" variant="md-regular" className="text-text-subtle">
          이사 조건을 입력하면 비슷한 견적 사례를 바탕으로 예상 가격 범위를 알려드려요.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-32 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <PricePredictionForm isPending={isPending} onSubmit={handleSubmit} />

        <PricePredictionResult
          prediction={prediction}
          isPending={isPending}
          isError={isError}
          error={error}
        />
      </div>
    </div>
  );
}
