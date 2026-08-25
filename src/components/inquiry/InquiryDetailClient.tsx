"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Text } from "@/components/common/Text";
import { useAddInquiryMessage } from "@/hooks/inquiry/useAddInquiryMessage";
import { useCloseInquiry } from "@/hooks/inquiry/useCloseInquiry";
import { useInquiryDetail } from "@/hooks/inquiry/useInquiryDetail";
import { hasSuspensionAppealSession } from "@/lib/auth/suspensionAppealSession";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { formatKoreanDateTimeWithTime } from "@/lib/utils/date";
import type { InquiryCategory, InquiryStatus } from "@/types/inquiry";

interface InquiryDetailClientProps {
  inquiryId: number;
}

const CATEGORY_LABEL: Record<InquiryCategory, string> = {
  SUSPENSION_APPEAL: "정지 이의신청",
  ACCOUNT: "계정",
  SERVICE: "서비스 이용",
  ETC: "기타",
};

const STATUS_LABEL: Record<InquiryStatus, string> = {
  OPEN: "답변 대기",
  ANSWERED: "답변 완료",
  CLOSED: "종료",
};

const InquiryDetailClient = ({ inquiryId }: InquiryDetailClientProps) => {
  const [content, setContent] = useState("");
  const isSuspensionAppealAccess = hasSuspensionAppealSession();

  const { data, isPending, isError, refetch } = useInquiryDetail(inquiryId);

  const addMessageMutation = useAddInquiryMessage(inquiryId);

  const closeMutation = useCloseInquiry(inquiryId);

  if (!Number.isInteger(inquiryId) || inquiryId <= 0) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full items-center justify-center py-48 md:px-40">
        <Text as="p" variant="lg-medium" className="text-text-muted">
          올바르지 않은 문의입니다.
        </Text>
      </main>
    );
  }

  if (isPending) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full items-center justify-center md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          문의 내용을 불러오는 중이에요
        </Text>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[400px] w-full flex-col items-center justify-center gap-12 md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          문의 내용을 불러오지 못했어요
        </Text>

        <button
          type="button"
          onClick={() => void refetch()}
          className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
        >
          <Text as="span" variant="md-medium">
            다시 불러오기
          </Text>
        </button>

        <Link
          href={APP_ROUTES.INQUIRIES.ROOT}
          className="text-text-secondary hover:text-text-primary"
        >
          <Text as="span" variant="md-medium">
            문의 목록으로
          </Text>
        </Link>
      </main>
    );
  }

  const isClosed = data.status === "CLOSED";
  const isReadOnly = isSuspensionAppealAccess && data.category !== "SUSPENSION_APPEAL";

  const trimmedContent = content.trim();

  const canSend =
    !isClosed && !isReadOnly && trimmedContent.length > 0 && !addMessageMutation.isPending;

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

    const confirmed = window.confirm(
      "문의를 종료하시겠습니까?\n종료 후에는 추가 문의를 작성할 수 없습니다.",
    );

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
            ← 문의 목록
          </Text>
        </Link>
      </div>

      {/* 문의 기본 정보 */}
      <header className="border-border-default flex flex-col gap-16 border-b pb-24">
        <div className="flex flex-wrap items-center gap-8">
          <span className="border-border-default text-text-secondary rounded-6 border px-8 py-4">
            <Text as="span" variant="xs-medium">
              {CATEGORY_LABEL[data.category]}
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
              {STATUS_LABEL[data.status]}
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
          {data.title}
        </Text>

        <Text as="time" variant="xs-regular" className="text-text-muted">
          문의일 {formatKoreanDateTimeWithTime(data.createdAt)}
        </Text>
      </header>

      {/* 문의 스레드 */}
      <section aria-label="문의 답변 내역" className="border-border-default border-t">
        {data.messages.length === 0 ? (
          <div className="flex min-h-[160px] items-center justify-center">
            <Text as="p" variant="md-medium" className="text-text-muted">
              등록된 문의 내용이 없습니다.
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
                    {message.isAdmin ? "무빙 고객지원" : "나"}
                  </Text>

                  {message.isAdmin && (
                    <span className="bg-background-brand-subtle text-text-brand rounded-6 px-8 py-4">
                      <Text as="span" variant="xs-medium">
                        관리자 답변
                      </Text>
                    </span>
                  )}
                </div>

                <Text as="time" variant="xs-regular" className="text-text-muted shrink-0">
                  {formatKoreanDateTimeWithTime(message.createdAt)}
                </Text>
              </header>

              <Text
                as="p"
                variant="md-regular"
                className="text-text-primary leading-relaxed break-words whitespace-pre-wrap"
              >
                {message.content}
              </Text>
            </article>
          ))
        )}
      </section>

      {/* 종료된 문의 */}
      {isReadOnly ? (
        <div className="bg-background-subtle rounded-8 px-16 py-20 text-center">
          <Text as="p" variant="md-medium" className="text-text-muted">
            정지 상태에서는 기존 문의를 읽기 전용으로 확인할 수 있습니다.
          </Text>
        </div>
      ) : isClosed ? (
        <div className="bg-background-subtle rounded-8 px-16 py-20 text-center">
          <Text as="p" variant="md-medium" className="text-text-muted">
            종료된 문의입니다. 추가 문의를 작성할 수 없습니다.
          </Text>
        </div>
      ) : (
        /* 추가 문의 작성 */
        <form onSubmit={handleMessageSubmit} className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <label htmlFor="inquiry-message">
              <Text as="span" variant="lg-semibold" className="text-text-primary">
                {isSuspensionAppealAccess ? "이의 제기 추가 내용" : "추가 문의"}
              </Text>
            </label>

            <Text as="p" variant="xs-regular" className="text-text-muted">
              {isSuspensionAppealAccess
                ? "정지 이의 제기와 관련된 추가 내용을 남길 수 있습니다."
                : "기존 문의에 이어서 궁금한 내용을 남길 수 있습니다."}
            </Text>
          </div>

          <div className="border-border-default rounded-8 overflow-hidden border">
            <textarea
              id="inquiry-message"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="추가로 문의하실 내용을 작성해 주세요."
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
                  {addMessageMutation.isPending ? "등록 중..." : "추가 문의 등록"}
                </Text>
              </button>
            </div>
          </div>

          {addMessageMutation.isError && (
            <Text as="p" variant="xs-regular" className="text-text-error" role="alert">
              추가 문의 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.
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
              목록으로
            </Text>
          </Link>

          {!isClosed && !isSuspensionAppealAccess && (
            <button
              type="button"
              onClick={handleClose}
              disabled={closeMutation.isPending}
              className="border-border-default text-text-secondary rounded-8 border px-20 py-10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Text as="span" variant="md-semibold">
                {closeMutation.isPending ? "종료 중..." : "문의 종료"}
              </Text>
            </button>
          )}
        </div>
        {closeMutation.isError && (
          <Text as="p" variant="xs-regular" className="text-text-error text-right" role="alert">
            문의 종료에 실패했습니다. 잠시 후 다시 시도해 주세요.
          </Text>
        )}
      </footer>
    </main>
  );
};

export default InquiryDetailClient;
