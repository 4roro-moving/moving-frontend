"use client";

import { useState } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";
import Pagination from "@/components/common/Pagination/Pagination";
import { Text } from "@/components/common/Text";
import MyReportCardSkeletonList from "@/components/report/MyReportCardSkeletonList";
import { useMyReports } from "@/hooks/report/useMyReports";
import { cn } from "@/lib/utils/cn";
import type { MyReportItem, ReportReason, ReportStatus, ReportTargetType } from "@/types/report";

const PAGE_SIZE = 10;

const TARGET_LABEL: Record<ReportTargetType, string> = {
  CUSTOMER: "고객",
  MOVER: "기사님",
  REVIEW: "리뷰",
  RESIDENCE_REVIEW: "거주 후기",
  GIVEAWAY: "나눔",
};

const TARGET_BADGE_CLASS: Record<ReportTargetType, string> = {
  CUSTOMER: "bg-background-subtle text-text-secondary border-border-default",
  MOVER: "bg-background-brand-muted text-text-brand border-border-brand",
  REVIEW: "bg-[#FFF4E8] text-[#B85C00] border-[#FFD7A8]",
  RESIDENCE_REVIEW: "bg-[#F1F7FF] text-[#3B6EA8] border-[#CFE3FF]",
  GIVEAWAY: "bg-[#F4F0FF] text-[#6A4FB3] border-[#DED2FF]",
};

const REASON_LABEL: Record<ReportReason, string> = {
  SPAM: "스팸/광고",
  ABUSE: "욕설/비방",
  FALSE_INFO: "허위 정보",
  INAPPROPRIATE: "부적절한 내용",
  PRIVACY: "개인정보 노출",
  OTHER: "기타",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  PENDING: "처리 대기",
  RESOLVED: "처리 완료",
  REJECTED: "반려",
};

const STATUS_MESSAGE: Record<ReportStatus, string> = {
  PENDING: "신고 내용을 확인하고 있습니다.",
  RESOLVED: "신고하신 내용에 대한 조치가 완료되었습니다.",
  REJECTED: "검토 결과 별도 조치 없이 종료되었습니다.",
};

const EMPTY_DESCRIPTION = (
  <>
    아직 접수한 신고가 없어요.
    <br />
    신고를 접수하면 처리 상태를 여기에서 확인할 수 있어요.
  </>
);

const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, ".");

interface ReportStatusBadgeProps {
  status: ReportStatus;
}

const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
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
        {STATUS_LABEL[status]}
      </Text>
    </span>
  );
};

interface ReportCardProps {
  report: MyReportItem;
}

const ReportCard = ({ report }: ReportCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const panelId = `report-panel-${report.id}`;
  const buttonId = `report-button-${report.id}`;

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
                  {TARGET_LABEL[report.targetType]}
                </Text>
              </span>

              <ReportStatusBadge status={report.status} />
            </div>

            <Text
              as="span"
              variant={{
                base: "md-medium",
                md: "lg-medium",
              }}
              className="text-text-primary"
            >
              {REASON_LABEL[report.reason]}
            </Text>
          </div>

          <Text as="time" variant="xs-regular" className="text-text-muted shrink-0">
            {formatDate(report.createdAt)}
          </Text>
        </div>

        {report.description ? (
          <Text
            as="p"
            variant="md-regular"
            className={cn("text-text-secondary", !isOpen && "line-clamp-2")}
          >
            {report.description}
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
                    신고 대상
                  </Text>
                </dt>

                <dd>
                  <Text as="span" variant="md-regular" className="text-text-primary">
                    {TARGET_LABEL[report.targetType]}
                  </Text>
                </dd>
              </div>

              <div className="grid gap-4">
                <dt>
                  <Text as="span" variant="sm-semibold" className="text-text-secondary">
                    신고 사유
                  </Text>
                </dt>

                <dd>
                  <Text as="span" variant="md-regular" className="text-text-primary">
                    {REASON_LABEL[report.reason]}
                  </Text>
                </dd>
              </div>

              {report.description ? (
                <div className="grid gap-4">
                  <dt>
                    <Text as="span" variant="sm-semibold" className="text-text-secondary">
                      상세 내용
                    </Text>
                  </dt>

                  <dd>
                    <Text
                      as="p"
                      variant="md-regular"
                      className="text-text-primary break-words whitespace-pre-wrap"
                    >
                      {report.description}
                    </Text>
                  </dd>
                </div>
              ) : null}

              <div className="grid gap-4">
                <dt>
                  <Text as="span" variant="sm-semibold" className="text-text-secondary">
                    신고일
                  </Text>
                </dt>

                <dd>
                  <Text as="time" variant="md-regular" className="text-text-primary">
                    {formatDate(report.createdAt)}
                  </Text>
                </dd>
              </div>

              {report.handledAt ? (
                <div className="grid gap-4">
                  <dt>
                    <Text as="span" variant="sm-semibold" className="text-text-secondary">
                      처리일
                    </Text>
                  </dt>

                  <dd>
                    <Text as="time" variant="md-regular" className="text-text-primary">
                      {formatDate(report.handledAt)}
                    </Text>
                  </dd>
                </div>
              ) : null}
            </dl>

            {report.images.length > 0 ? (
              <section className="flex flex-col gap-8">
                <Text as="h3" variant="sm-semibold" className="text-text-secondary">
                  첨부 이미지
                </Text>

                <ul className="grid grid-cols-3 gap-8 sm:grid-cols-4 md:grid-cols-5">
                  {report.images.map((image, index) => (
                    <li key={image.id} className="rounded-8 relative aspect-square overflow-hidden">
                      <a
                        href={image.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`신고 첨부 이미지 ${index + 1} 크게 보기`}
                        className="block h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url("${image.imageUrl}")`,
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="border-border-default border-t pt-16">
              <Text as="p" variant="md-regular" className="text-text-muted">
                {STATUS_MESSAGE[report.status]}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

const MyReportsPageClient = () => {
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
        내 신고내역
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-40 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        {isPending ? <MyReportCardSkeletonList /> : null}

        {isError ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-12">
            <Text as="p" variant="md-medium" className="text-text-muted">
              신고내역을 불러오지 못했어요.
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
                {isFetching ? "불러오는 중..." : "다시 시도"}
              </Text>
            </button>
          </div>
        ) : null}

        {isEmpty ? (
          <EmptyState
            size="sm"
            imageSrc="/images/empty/character.png"
            description={EMPTY_DESCRIPTION}
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

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
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
