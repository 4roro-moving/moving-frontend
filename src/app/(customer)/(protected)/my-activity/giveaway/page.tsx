import type { Metadata } from "next";

import MyGiveawayPageView from "@/components/giveaway/MyGiveawayPageView";
import { parseMyGiveawaySearchParams } from "@/lib/utils/giveawaySearchParams";

export const metadata: Metadata = {
  title: "내가 작성한 나눔글",
  description: "내가 작성한 나눔 글을 확인할 수 있습니다.",
};

interface MyGiveawayPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const MyGiveawayPage = async ({ searchParams }: MyGiveawayPageProps) => {
  const filters = parseMyGiveawaySearchParams(await searchParams);

  return <MyGiveawayPageView filters={filters} />;
};

export default MyGiveawayPage;
