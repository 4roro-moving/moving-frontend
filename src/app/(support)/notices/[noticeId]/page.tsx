import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NoticeDetailClient from "@/components/notice/NoticeDetailClient";

interface NoticeDetailPageProps {
  params: Promise<{ noticeId: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("supportNotice");
  return { title: t("metadata.detailTitle"), description: t("metadata.detailDescription") };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { noticeId } = await params;
  const parsedNoticeId = Number(noticeId);

  if (!Number.isSafeInteger(parsedNoticeId) || parsedNoticeId <= 0) {
    notFound();
  }

  return <NoticeDetailClient noticeId={parsedNoticeId} />;
}
