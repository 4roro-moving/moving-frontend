"use client";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { useTranslations } from "next-intl";
import GiveawayDetailSkeleton from "@/components/giveaway/GiveawayDetailSkeleton";
import GiveawayDetailView from "@/components/giveaway/GiveawayDetailView";
import { useGiveawayDetail } from "@/hooks/giveaway/useGiveawayDetail";
import { useGiveawayReceivedRequests } from "@/hooks/giveaway/useGiveawayReceivedRequests";
import { useCustomerAuthReady } from "@/hooks/useCustomerAuthReady";
import { APP_ROUTES } from "@/lib/constants/appRoutes";

interface GiveawayDetailClientProps {
  giveawayId: number;
}

const GiveawayDetailClient = ({ giveawayId }: GiveawayDetailClientProps) => {
  const t = useTranslations("giveaway");
  const { user } = useCustomerAuthReady();
  const detailQuery = useGiveawayDetail(giveawayId);
  const isAuthor = detailQuery.data !== undefined && user?.id === detailQuery.data.author.id;
  const requestsQuery = useGiveawayReceivedRequests({
    giveawayId,
    enabled: isAuthor,
  });

  if (detailQuery.isPending) {
    return <GiveawayDetailSkeleton />;
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <>
        <PageHeader title={t("detailTitle")} backFallbackHref={APP_ROUTES.COMMUNITY.GIVEAWAY} />
        <main>
          <EmptyState
            size="sm"
            imageSrc="/images/empty/character.png"
            description={t("detailLoadFailed")}
            buttonLabel={t("reload")}
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
      requests={requestsQuery.requests}
      isRequestsPending={isAuthor && requestsQuery.isInitialLoading}
      requestsQuery={requestsQuery.query}
    />
  );
};

export default GiveawayDetailClient;
