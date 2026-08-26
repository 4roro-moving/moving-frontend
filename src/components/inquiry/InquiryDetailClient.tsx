"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";

import { Text } from "@/components/common/Text";
import { useAddInquiryMessage } from "@/hooks/inquiry/useAddInquiryMessage";
import { useCloseInquiry } from "@/hooks/inquiry/useCloseInquiry";
import { useInquiryDetail } from "@/hooks/inquiry/useInquiryDetail";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface InquiryDetailClientProps {
  inquiryId: number;
}

const InquiryDetailClient = ({ inquiryId }: InquiryDetailClientProps) => {
  const t = useTranslations("supportInquiry");
  const locale = useLocale();
  const [content, setContent] = useState("");

  const { data, isPending, isError, refetch } = useInquiryDetail(inquiryId);

  const addMessageMutation = useAddInquiryMessage(inquiryId);

  const closeMutation = useCloseInquiry(inquiryId);
  const formatDateTime = (value: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
      new Date(value),
    );

  if (!Number.isInteger(inquiryId) || inquiryId <= 0) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full items-center justify-center py-48 md:px-40">
        <Text as="p" variant="lg-medium" className="text-text-muted">
          {t("invalid")}
        </Text>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full items-center justify-center md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          {t("detailLoading")}
        </Text>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full flex-col items-center justify-center gap-12 md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          {t("detailLoadFailed")}
        </Text>

        <button
          type="button"
          onClick={() => void refetch()}
          className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
        >
          <Text as="span" variant="md-medium">
            {t("retry")}
          </Text>
        </button>

        <Link
          href={APP_ROUTES.INQUIRIES.ROOT}
          className="text-text-secondary hover:text-text-primary"
        >
          <Text as="span" variant="md-medium">
            {t("backToList")}
          </Text>
        </Link>
      </main>
    );
  }

  const isClosed = data.status === "CLOSED";

  const trimmedContent = content.trim();

  const canSend = !isClosed && trimmedContent.length > 0 && !addMessageMutation.isPending;

  const handleMessageSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSend) {
      return;
    }

    addMessageMutation.mutate(
      {
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  const handleClose = () => {
    if (isClosed || closeMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(t("closeConfirm"));

    if (!confirmed) {
      return;
    }

    closeMutation.mutate();
  };

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col gap-32 py-32 md:px-40 md:py-48">
      {/* 목록 이동 */}
      <div>
        <Link
          href={APP_ROUTES.INQUIRIES.ROOT}
          className="text-text-secondary hover:text-text-primary"
        >
          <Text as="span" variant="md-medium">
            {t("backToList")}
          </Text>
        </Link>
      </div>

      {/* 문의 기본 정보 */}
      <header className="border-border-default flex flex-col gap-16 border-b pb-24">
        <div className="flex flex-wrap items-center gap-8">
          <span className="border-border-default text-text-secondary rounded-6 border px-8 py-4">
            <Text as="span" variant="xs-medium">
              {t(`categories.${data.category}`)}
            </Text>
          </span>

          <span
            className={cn(
              "rounded-6 px-8 py-4",
              data.status === "OPEN" && "bg-background-subtle text-text-secondary",
              data.status === "ANSWERED" && "bg-background-brand-subtle text-text-brand",
              data.status === "CLOSED" && "bg-background-subtle text-text-muted",
            )}
          >
            <Text as="span" variant="xs-medium">
              {t(`statuses.${data.status}`)}
            </Text>
          </span>
        </div>

        <Text
          as="h1"
          variant={{
            base: "2xl-bold",
            md: "3xl-bold",
          }}
          className="text-text-primary"
        >
          <AutoTranslatedText text={data.title} />
        </Text>

        <Text as="time" variant="xs-regular" className="text-text-muted">
          {t("createdAt", { date: formatDateTime(data.createdAt) })}
        </Text>
      </header>

      {/* 문의 스레드 */}
      <section aria-label={t("threadHistoryLabel")} className="border-border-default border-t">
        {data.messages.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Text as="p" variant="md-medium" className="text-text-muted">
              {t("noMessages")}
            </Text>
          </div>
        ) : (
          data.messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "border-border-default flex flex-col gap-16 border-b px-8 py-24 md:px-16 md:py-28",
                message.isAdmin && "bg-background-subtle",
              )}
            >
              <header className="flex items-start justify-between gap-16">
                <div className="flex flex-wrap items-center gap-8">
                  <Text
                    as="span"
                    variant="md-semibold"
                    className={message.isAdmin ? "text-text-brand" : "text-text-primary"}
                  >
                    {message.isAdmin ? t("supportTeam") : t("me")}
                  </Text>

                  {message.isAdmin && (
                    <span className="bg-background-brand-subtle text-text-brand rounded-6 px-8 py-4">
                      <Text as="span" variant="xs-medium">
                        {t("adminReply")}
                      </Text>
                    </span>
                  )}
                </div>

                <Text as="time" variant="xs-regular" className="text-text-muted shrink-0">
                  {formatDateTime(message.createdAt)}
                </Text>
              </header>

              <Text
                as="p"
                variant="md-regular"
                className="text-text-primary leading-relaxed break-words whitespace-pre-wrap"
              >
                <AutoTranslatedText text={message.content} />
              </Text>
            </article>
          ))
        )}
      </section>

      {/* 종료된 문의 */}
      {isClosed ? (
        <div className="bg-background-subtle rounded-8 px-16 py-20 text-center">
          <Text as="p" variant="md-medium" className="text-text-muted">
            {t("closedHint")}
          </Text>
        </div>
      ) : (
        /* 추가 문의 작성 */
        <form onSubmit={handleMessageSubmit} className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <label htmlFor="inquiry-message">
              <Text as="span" variant="lg-semibold" className="text-text-primary">
                {t("additionalLabel")}
              </Text>
            </label>

            <Text as="p" variant="xs-regular" className="text-text-muted">
              {t("additionalDescription")}
            </Text>
          </div>

          <div className="border-border-default rounded-8 overflow-hidden border">
            <textarea
              id="inquiry-message"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={t("additionalPlaceholder")}
              rows={6}
              disabled={addMessageMutation.isPending}
              className="text-text-primary placeholder:text-text-muted w-full resize-none px-16 py-16 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="border-border-default flex justify-end border-t px-12 py-12">
              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "rounded-8 px-20 py-10",
                  canSend
                    ? "bg-background-brand text-text-inverse"
                    : "bg-background-disabled text-text-disabled cursor-not-allowed",
                )}
              >
                <Text as="span" variant="md-semibold">
                  {addMessageMutation.isPending ? t("creating") : t("additionalSubmit")}
                </Text>
              </button>
            </div>
          </div>

          {addMessageMutation.isError && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              {t("additionalFailed")}
            </Text>
          )}
        </form>
      )}

      {/* 하단 액션 */}
      <footer className="border-border-default flex flex-col gap-8 border-t pt-24">
        <div className="flex items-center justify-between gap-12">
          <Link
            href={APP_ROUTES.INQUIRIES.ROOT}
            className="border-border-default text-text-secondary rounded-8 border px-20 py-10"
          >
            <Text as="span" variant="md-semibold">
              {t("backToList")}
            </Text>
          </Link>

          {!isClosed && (
            <button
              type="button"
              onClick={handleClose}
              disabled={closeMutation.isPending}
              className="border-border-default text-text-secondary rounded-8 border px-20 py-10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Text as="span" variant="md-semibold">
                {closeMutation.isPending ? t("closing") : t("close")}
              </Text>
            </button>
          )}
        </div>
        {closeMutation.isError && (
          <Text as="p" variant="xs-regular" className="text-text-error text-right" role="alert">
            {t("closeFailed")}
          </Text>
        )}
      </footer>
    </main>
  );
};

export default InquiryDetailClient;
