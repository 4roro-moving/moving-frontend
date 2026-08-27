"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import MyReportCardSkeletonList from "@/components/report/MyReportCardSkeletonList";
import { useMyReports } from "@/hooks/report/useMyReports";
import { cn } from "@/lib/utils/cn";
import type { MyReportItem, ReportReason, ReportStatus, ReportTargetType } from "@/types/report";

const PAGE_SIZE = 10;

const TARGET_KEY: Record<ReportTargetType, string> = {
  CUSTOMER: "customer",
  MOVER: "mover",
  REVIEW: "review",
  RESIDENCE_REVIEW: "residenceReview",
  GIVEAWAY: "giveaway",
};

const TARGET_BADGE_CLASS: Record<ReportTargetType, string> = {
  CUSTOMER: "bg-background-subtle text-text-secondary border-border-default",
  MOVER: "bg-background-brand-muted text-text-brand border-border-brand",
  REVIEW: "bg-[#FFF4E8] text-[#B85C00] border-[#FFD7A8]",
  RESIDENCE_REVIEW: "bg-[#F1F7FF] text-[#3B6EA8] border-[#CFE3FF]",
  GIVEAWAY: "bg-[#F4F0FF] text-[#6A4FB3] border-[#DED2FF]",
};

const REASON_KEY: Record<ReportReason, string> = {
  SPAM: "spam",
  ABUSE: "abuse",
  FALSE_INFO: "falseInfo",
  INAPPROPRIATE: "inappropriate",
  PRIVACY: "privacy",
  OTHER: "other",
};

const STATUS_KEY: Record<ReportStatus, string> = {
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
  const t = useTranslations("report");

  return (
    <span
      className={cn(
        "rounded-6 px-8 py-4",
        status === "PENDING" && "bg-background-subtle text-text-secondary",
        status === "RESOLVED" && "bg-background-brand-muted text-text-brand",
        status === "REJECTED" && "bg-background-subtle text-text-muted",
      )}
    >
      <Text as="span" variant="xs-medium">
        {t(`statuses.${STATUS_KEY[status]}`)}
      </Text>
    </span>
  );
};

interface ReportCardProps {
  report: MyReportItem;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const t = useTranslations("report");
  const format = useFormatter();
  const [isOpen, setIsOpen] = useState(false);

  const panelId = `report-panel-${report.id}`;
  const buttonId = `report-button-${report.id}`;
  const targetLabel = t(`targets.${TARGET_KEY[report.targetType]}`);
  const reasonLabel = t(`reasons.${REASON_KEY[report.reason]}`);
  const formattedCreatedAt = format.dateTime(new Date(report.createdAt), {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const formattedHandledAt = report.handledAt
    ? format.dateTime(new Date(report.handledAt), {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : null;

  return (
    <li className="border-border-default bg-background-default rounded-16 overflow-hidden border">
      <button
        id={buttonId}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="hover:bg-background-brand-muted flex w-full flex-col gap-12 px-20 py-20 text-left transition-colors md:px-24 md:py-24"
      >
        <div className="flex w-full items-start justify-between gap-16">
          <div className="flex min-w-0 flex-1 flex-col gap-8">
            <div className="flex flex-wrap items-center gap-8">
              <span
                className={cn("rounded-6 border px-8 py-4", TARGET_BADGE_CLASS[report.targetType])}
              >
                <Text as="span" variant="xs-medium">
                  {targetLabel}
                </Text>
              </span>
              <ReportStatusBadge status={report.status} />
            </div>
            <Text
              as="span"
              variant={{ base: "md-medium", md: "lg-medium" }}
              className="text-text-primary"
            >
              {reasonLabel}
            </Text>
          </div>
          <Text as="time" variant="xs-regular" className="text-text-muted shrink-0">
            {formattedCreatedAt}
          </Text>
        </div>

        {report.description ? (
          <Text
            as="p"
            variant="md-regular"
            className={cn("text-text-secondary", !isOpen && "line-clamp-2")}
          >
            <AutoTranslatedText text={report.description} />
          </Text>
        ) : null}
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="bg-background-subtle border-border-default flex flex-col gap-20 border-t px-20 py-20 md:px-24 md:py-24">
            <dl className="grid gap-16">
              <div className="grid gap-4">
                <dt>
                  <Text as="span" variant="sm-semibold" className="text-text-secondary">
                    {t("myReports.target")}
                  </Text>
                </dt>
                <dd>
                  <Text as="span" variant="md-regular" className="text-text-primary">
                    {targetLabel}
                  </Text>
                </dd>
              </div>
              <div className="grid gap-4">
                <dt>
                  <Text as="span" variant="sm-semibold" className="text-text-secondary">
                    {t("myReports.reason")}
                  </Text>
                </dt>
                <dd>
                  <Text as="span" variant="md-regular" className="text-text-primary">
                    {reasonLabel}
                  </Text>
                </dd>
              </div>
              {report.description ? (
                <div className="grid gap-4">
                  <dt>
                    <Text as="span" variant="sm-semibold" className="text-text-secondary">
                      {t("myReports.description")}
                    </Text>
                  </dt>
                  <dd>
                    <Text
                      as="dd"
                      variant="md-regular"
                      className="text-text-primary wrap-break-word whitespace-pre-wrap"
                    >
                      <AutoTranslatedText text={report.description} />
                    </Text>
                  </dd>
                </div>
              ) : null}
              <div className="grid gap-4">
                <dt>
                  <Text as="span" variant="sm-semibold" className="text-text-secondary">
                    {t("myReports.reportedAt")}
                  </Text>
                </dt>
                <dd>
                  <Text as="time" variant="md-regular" className="text-text-primary">
                    {formattedCreatedAt}
                  </Text>
                </dd>
              </div>
              {formattedHandledAt ? (
                <div className="grid gap-4">
                  <dt>
                    <Text as="span" variant="sm-semibold" className="text-text-secondary">
                      {t("myReports.handledAt")}
                    </Text>
                  </dt>
                  <dd>
                    <Text as="time" variant="md-regular" className="text-text-primary">
                      {formattedHandledAt}
                    </Text>
                  </dd>
                </div>
              ) : null}
            </dl>

            {report.images.length > 0 ? (
              <section className="flex flex-col gap-8">
                <Text as="h3" variant="sm-semibold" className="text-text-secondary">
                  {t("myReports.attachments")}
                </Text>
                <ul className="grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-5">
                  {report.images.map((image, index) => (
                    <li key={image.id} className="rounded-8 relative aspect-square overflow-hidden">
                      <a
                        href={image.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t("myReports.openAttachmentAria", { index: index + 1 })}
                        className="block h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url("${image.imageUrl}")` }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="border-border-default border-t pt-16">
              <Text as="p" variant="md-regular" className="text-text-muted">
                {t(`statusMessages.${STATUS_KEY[report.status]}`)}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const MyReportsPageClient = () => {
  const t = useTranslations("report");
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isFetching } = useMyReports({
    page,
    limit: PAGE_SIZE,
  });

  const reports = data?.reports ?? [];
  const pagination = data?.pagination;
  const isEmpty = !isPending && !isError && Boolean(pagination) && reports.length === 0;
  const hasList = !isPending && !isError && reports.length > 0;

  return (
    <main className="bg-background-subtle flex min-h-screen w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        {t("myReports.title")}
      </Text>
      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-40 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        {isPending ? <MyReportCardSkeletonList /> : null}
        {isError ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-12">
            <Text as="p" variant="md-medium" className="text-text-muted">
              {t("myReports.loadFailed")}
            </Text>
            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={isFetching}
              className="border-border-brand text-text-brand rounded-8 border px-16 py-8 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Text as="span" variant="md-medium">
                {isFetching ? t("myReports.loading") : t("myReports.retry")}
              </Text>
            </button>
          </div>
        ) : null}
        {isEmpty ? (
          <EmptyState
            size="sm"
            imageSrc="/images/empty/character.png"
            description={
              <>
                {t("myReports.emptyTitle")}
                <br />
                {t("myReports.emptyDescription")}
              </>
            }
          />
        ) : null}
        {hasList && pagination ? (
          <div className="flex w-full flex-col gap-40" aria-busy={isFetching}>
            <ul className="flex w-full flex-col gap-20">
              {reports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </ul>
            {pagination.totalPages > 1 ? (
              <Pagination
                currentPage={page}
                pageCount={pagination.totalPages}
                onPageChange={(nextPage) => {
                  setPage(nextPage);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default MyReportsPageClient;
