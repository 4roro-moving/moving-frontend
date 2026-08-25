import { Skeleton } from "@/components/common/Skeleton/Skeleton";

interface GiveawayCardSkeletonListProps {
  count?: number;
}

const GiveawayCardSkeletonList = ({ count = 8 }: GiveawayCardSkeletonListProps) => {
  const t = useTranslations("giveaway");
  return (
    <div>
      <ul className="grid grid-cols-1 gap-20 md:grid-cols-2 xl:grid-cols-4" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <li key={index}>
            <div className="bg-background-default border-border-subtle shadow-estimate-card rounded-20 flex flex-col gap-20 border-[0.5px] p-40">
              <Skeleton className="rounded-6 h-[219px] w-full" />
              <div className="flex flex-col gap-12">
                <Skeleton className="h-32 w-4/5 self-center" />
                <div className="flex w-full items-center justify-between">
                  <Skeleton className="h-24 w-80" />
                  <Skeleton className="h-24 w-40" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <p className="sr-only" role="status">
        {t("listLoading")}
      </p>
    </div>
  );
};

export default GiveawayCardSkeletonList;
("use client");

import { useTranslations } from "next-intl";
