"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { useNoticeDetail } from "@/hooks/notice/useNoticeDetail";

interface NoticeDetailClientProps {
  noticeId: number;
}

const formatDate = (value: string) => value.slice(0, 10).replace(/-/g, ".");

const NoticeDetailClient = ({ noticeId }: NoticeDetailClientProps) => {
  const t = useTranslations("supportNotice");
  const { data, isPending, isError, refetch } = useNoticeDetail(noticeId);

  if (isPending) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[420px] w-full items-center justify-center md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          {t("loading")}
        </Text>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="px-margin-mobile max-w-container-desktop mx-auto flex min-h-[420px] w-full flex-col items-center justify-center gap-12 md:px-40">
        <Text as="p" variant="md-medium" className="text-text-muted">
          {t("loadFailed")}
        </Text>
        <button
          type="button"
          onClick={() => void refetch()}
          className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
        >
          {t("retry")}
        </button>
        <Link href="/notices" className="text-text-secondary underline">
          {t("title")}
        </Link>
      </main>
    );
  }

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col py-32 md:px-40 md:py-48">
      <Link href="/notices" className="text-text-secondary hover:text-text-primary mb-24 w-fit">
        <Text as="span" variant="md-medium">
          {`← ${t("title")}`}
        </Text>
      </Link>

      <article>
        <header className="border-border-default flex flex-col gap-12 border-b pb-24">
          <div className="flex flex-wrap items-center gap-8">
            {data.isPinned && (
              <span className="bg-background-brand-subtle text-text-brand rounded-6 px-8 py-4">
                <Text as="span" variant="sm-semibold">
                  {t("pinned")}
                </Text>
              </span>
            )}
            <span className="border-border-default text-text-secondary rounded-6 border px-8 py-4">
              <Text as="span" variant="sm-medium">
                {t(`categories.${data.category}`)}
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
              {t("views", { count: data.viewCount.toLocaleString() })}
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
