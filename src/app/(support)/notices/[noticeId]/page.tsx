import type { Metadata } from "next";
import { notFound } from "next/navigation";

import NoticeDetailClient from "@/components/notice/NoticeDetailClient";

interface NoticeDetailPageProps {
  params: Promise<{ noticeId: string }>;
}

export const metadata: Metadata = {
  title: "공지사항 상세 | 무빙",
  description: "무빙 서비스의 공지사항 상세 내용을 확인할 수 있습니다.",
};

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { noticeId } = await params;
  const parsedNoticeId = Number(noticeId);

  if (!Number.isSafeInteger(parsedNoticeId) || parsedNoticeId <= 0) {
    notFound();
  }

  return <NoticeDetailClient noticeId={parsedNoticeId} />;
}
