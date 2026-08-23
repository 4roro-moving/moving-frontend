import type { Metadata } from "next";

import PricePredictionPageClient from "@/components/price-prediction/PricePredictionPageClient";

export const metadata: Metadata = {
  title: "예상 견적 | MOVING",
  description: "이사 조건을 입력하고 유사 견적 데이터를 기반으로 예상 이사 비용을 확인해보세요.",
};

export default function PricePredictionPage() {
  return (
    <main className="bg-background-subtle min-h-screen px-24 py-40 md:px-40 md:py-64">
      <PricePredictionPageClient />
    </main>
  );
}
