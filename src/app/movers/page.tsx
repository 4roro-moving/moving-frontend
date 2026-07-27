import type { Metadata } from "next";

import { MoversPageView } from "@/components/mover/MoversPageView";
import { parseMoversSearchParams } from "@/lib/utils/moversSearchParams";

export const metadata: Metadata = {
  title: "기사님 찾기",
  description: "내 이사 조건에 맞는 기사님을 찾고, 평점과 경력, 확정 건수를 비교해 보세요.",
};

interface MoversPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MoversPage({ searchParams }: MoversPageProps) {
  const filters = parseMoversSearchParams(await searchParams);

  return <MoversPageView filters={filters} />;
}
