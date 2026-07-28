import type { Metadata } from "next";

import MoverDetailView from "@/components/mover/detail/MoverDetailView";
import { getMockMoverDetail } from "@/components/mover/detail/moverDetailMock";

interface MoverDetailPageProps {
  params: Promise<{ moverId: string }>;
}

export async function generateMetadata({ params }: MoverDetailPageProps): Promise<Metadata> {
  const { moverId } = await params;
  const detail = getMockMoverDetail(moverId);
  const name = detail?.name ?? "기사님";

  return {
    title: `${name} 기사님 상세`,
    description: detail?.title ?? "이사 기사님 상세 정보를 확인하세요.",
  };
}

export default async function MoverDetailPage({ params }: MoverDetailPageProps) {
  const { moverId } = await params;

  return <MoverDetailView moverId={moverId} />;
}
