"use client";

import Link from "next/link";

import { Text } from "@/components/common/Text";
import { useNoticeDetail } from "@/hooks/notice/useNoticeDetail";
import { NOTICE_CATEGORY_LABEL } from "@/types/notice";

interface NoticeDetailClientProps {
  noticeId: number;
}

const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, ".");

const NoticeDetailClient = ({ noticeId }: NoticeDetailClientProps) => {
  const { data, isPending, isError, refetch } = useNoticeDetail(noticeId);

  if (isPending) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[420px] w-full items-center justify-center md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          공지사항을 불러오는 중이에요
        </Text>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[420px] w-full flex-col items-center justify-center gap-12 md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          공지사항을 불러오지 못했어요
        </Text>
        <button
          type="button"
          onClick={() => void refetch()}
          className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
        >
          다시 불러오기
        </button>
        <Link href="/notices" className="text-text-secondary underline">
          공지사항 목록으로
        </Link>
      </main>
    );
  }

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col py-32 md:px-40 md:py-48">
      <Link href="/notices" className="text-text-secondary hover:text-text-primary mb-24 w-fit">
        <Text as="span" variant="md-medium">
          ← 목록으로
        </Text>
      </Link>

      <article>
        <header className="border-border-default flex flex-col gap-12 border-b pb-24">
          <div className="flex flex-wrap items-center gap-8">
            {data.isPinned && (
              <span className="bg-background-brand-subtle text-text-brand rounded-6 px-8 py-4">
                <Text as="span" variant="sm-semibold">
                  중요
                </Text>
              </span>
            )}
            <span className="border-border-default text-text-secondary rounded-6 border px-8 py-4">
              <Text as="span" variant="sm-medium">
                {NOTICE_CATEGORY_LABEL[data.category]}
              </Text>
            </span>
          </div>

          <Text
            as="h1"
            variant={{ base: "2xl-bold", md: "3xl-bold" }}
            className="text-text-primary"
          >
            {data.title}
          </Text>

          <div className="text-text-muted flex items-center gap-16">
            <Text as="time" variant="xs-regular">
              {formatDate(data.createdAt)}
            </Text>
            <Text as="span" variant="xs-regular">
              조회 {data.viewCount.toLocaleString()}
            </Text>
          </div>
        </header>

        <div className="py-28">
          <Text
            as="div"
            variant={{ base: "md-regular", md: "lg-regular" }}
            className="text-text-primary leading-relaxed break-words whitespace-pre-wrap"
          >
            {data.content}
          </Text>
        </div>
      </article>
    </main>
  );
};

export default NoticeDetailClient;
