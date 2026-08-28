"use client";

import { useTranslations } from "next-intl";

const MyReportCardSkeleton = () => {
  return (
    <div className="border-border-default bg-background-default rounded-16 flex w-full flex-col gap-16 border px-20 py-20">
      <div className="flex items-start justify-between gap-16">
        <div className="flex flex-1 flex-col gap-12">
          <div className="flex gap-8">
            <div className="bg-background-disabled rounded-6 h-26 w-52 animate-pulse" />
            <div className="bg-background-disabled rounded-6 h-26 w-60 animate-pulse" />
          </div>
          <div className="bg-background-disabled rounded-6 h-24 w-120 animate-pulse" />
        </div>
        <div className="bg-background-disabled rounded-6 h-18 w-72 animate-pulse" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="bg-background-disabled rounded-6 h-18 w-full animate-pulse" />
        <div className="bg-background-disabled rounded-6 h-18 w-2/3 animate-pulse" />
      </div>
    </div>
  );
};

const MyReportCardSkeletonList = () => {
  const t = useTranslations("report");

  return (
    <div
      className="flex w-full flex-col gap-20"
      aria-label={t("myReports.loadingAria")}
      aria-busy="true"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <MyReportCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default MyReportCardSkeletonList;
