import type { Metadata } from "next";

import InquiryDetailClient from "@/components/inquiry/InquiryDetailClient";

interface InquiryDetailPageProps {
  params: Promise<{
    inquiryId: string;
  }>;
}

export const metadata: Metadata = {
  title: "1:1 문의 상세 | 무빙",
  description: "등록한 1:1 문의 내용과 답변 내역을 확인할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { inquiryId } = await params;

  return <InquiryDetailClient inquiryId={Number(inquiryId)} />;
}
