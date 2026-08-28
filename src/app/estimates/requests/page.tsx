import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import { EstimateRequestListSkeleton } from "@/components/estimate/requests/EstimateRequestLoadingSkeletons";
import EstimateRequestsPageClient from "@/components/estimate/requests/EstimateRequestsPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("estimates");
  return { title: t("metadata.requestsTitle"), description: t("metadata.requestsDescription") };
}

// 2026.07.29 정슬기 - [추가] 보낸 견적 요청 목록 페이지
// 2026.08.10 정슬기 - [수정] 인증 확인 중에도 목록 Skeleton 노출
export default function EstimateRequestsPage() {
  return (
    <CustomerAuthGate
      loadingFallback={
        <div className="bg-background-default md:bg-background-subtle flex w-full flex-1 flex-col items-center py-38 md:py-32 xl:py-64">
          <EstimateRequestListSkeleton showFilter />
        </div>
      }
    >
      <EstimateRequestsPageClient />
    </CustomerAuthGate>
  );
}
