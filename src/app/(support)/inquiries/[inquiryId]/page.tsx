import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

import InquiryDetailClient from "@/components/inquiry/InquiryDetailClient";

interface InquiryDetailPageProps {
  params: Promise<{
    inquiryId: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("supportInquiry");
  return { title: t("metadata.detailTitle"), description: t("metadata.detailDescription") };
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { inquiryId } = await params;

  return <InquiryDetailClient inquiryId={Number(inquiryId)} />;
}
