"use client";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import GiveawayDetailSkeleton from "@/components/giveaway/GiveawayDetailSkeleton";
import GiveawayDetailView from "@/components/giveaway/GiveawayDetailView";
import { useGiveawayDetail } from "@/hooks/giveaway/useGiveawayDetail";
import { useGiveawayPendingRequests } from "@/hooks/giveaway/useGiveawayPendingRequests";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { GIVEAWAY_DETAIL_TITLE } from "@/lib/constants/giveaway";

interface GiveawayDetailClientProps {
  giveawayId: number;
}

const GiveawayDetailClient = ({ giveawayId }: GiveawayDetailClientProps) => {
  const { user } = useCustomerAuthReady();
  const detailQuery = useGiveawayDetail(giveawayId);
  const isAuthor = detailQuery.data !== undefined && user?.id === detailQuery.data.author.id;
  const requestsQuery = useGiveawayPendingRequests({
    giveawayId,
    giveawayStatus: detailQuery.data?.status,
    enabled: isAuthor,
  });

  if (detailQuery.isPending) {
    return <GiveawayDetailSkeleton />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <>
        <PageHeader
          title={GIVEAWAY_DETAIL_TITLE}
          backFallbackHref={APP_ROUTES.COMMUNITY.GIVEAWAY}
        />
        <main>
          <EmptyState
            size="sm"
            imageSrc="/images/empty/character.png"
            description="나눔 글을 불러오지 못했어요"
            buttonLabel="다시 불러오기"
            onActionClick={() => void detailQuery.refetch()}
          />
        </main>
      </>
    );
  }

  return (
    <GiveawayDetailView
      giveaway={detailQuery.data}
      isAuthor={isAuthor}
      requests={requestsQuery.data?.data ?? []}
      isRequestsPending={isAuthor && requestsQuery.isPending}
    />
  );
};

export default GiveawayDetailClient;
