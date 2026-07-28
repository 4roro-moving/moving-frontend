import type { Metadata } from "next";

import MoverDetailView from "@/components/mover/detail/MoverDetailView";

interface MoverDetailPageProps {
  params: Promise<{ moverId: string }>;
}

export const metadata: Metadata = {
  title: "기사님 상세",
  description: "이사 기사님 상세 정보를 확인하세요.",
};

export default async function MoverDetailPage({ params }: MoverDetailPageProps) {
  const { moverId } = await params;

  return <MoverDetailView key={moverId} moverId={moverId} />;
}
