import NoticeDetailClient from "@/components/notice/NoticeDetailClient";

interface NoticeDetailPageProps {
  params: Promise<{ noticeId: string }>;
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { noticeId } = await params;
  return <NoticeDetailClient noticeId={Number(noticeId)} />;
}
