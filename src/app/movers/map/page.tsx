import type { Metadata } from "next";

import { MoverRecommendationMapPage } from "@/components/mover/map/MoverRecommendationMapPage";

export const metadata: Metadata = {
  title: "기사님 추천",
  description: "출발지와 도착지의 서비스 지역을 기준으로 기사님을 추천받아 보세요.",
};

export default function MoversMapPage() {
  return <MoverRecommendationMapPage />;
}
