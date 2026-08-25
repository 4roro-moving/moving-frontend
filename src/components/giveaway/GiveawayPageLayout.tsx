"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Text } from "@/components/common/Text";
import GiveawayFilters from "@/components/giveaway/GiveawayFilters";
import MyGiveawayFilters from "@/components/giveaway/MyGiveawayFilters";
import type {
  GiveawayMyFilterState,
  GiveawaySearchParamsState,
} from "@/lib/utils/giveawaySearchParams";

type GiveawayPageLayoutProps = {
  children: ReactNode;
} & (
  | { variant?: "community"; filters: GiveawaySearchParamsState }
  | { variant: "my"; filters: GiveawayMyFilterState }
);

const GiveawayPageLayout = (props: GiveawayPageLayoutProps) => {
  const t = useTranslations("giveaway");
  const isMy = props.variant === "my";

  return (
    <div className="bg-background-default flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        {isMy ? t("myTitle") : t("title")}
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full flex-col gap-24 pt-24 pb-80 xl:px-0 xl:pt-32 xl:pb-120">
        {isMy ? (
          <MyGiveawayFilters filters={props.filters} />
        ) : (
          <GiveawayFilters filters={props.filters} />
        )}
        {props.children}
      </div>
    </div>
  );
};

export default GiveawayPageLayout;
