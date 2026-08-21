import type { Metadata } from "next";

import MyGiveawayRequestPageView from "@/components/giveaway/MyGiveawayRequestPageView";
import { parseGiveawayRequestSearchParams } from "@/lib/utils/giveawayRequestSearchParams";

export const metadata: Metadata = {
  title: "내가 작성한 나눔 신청글",
  description: "내가 신청한 나눔 글을 확인할 수 있습니다.",
};

interface MyGiveawayRequestPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const MyGiveawayRequestPage = async ({ searchParams }: MyGiveawayRequestPageProps) => {
  const filters = parseGiveawayRequestSearchParams(await searchParams);

  return <MyGiveawayRequestPageView filters={filters} />;
};

export default MyGiveawayRequestPage;
