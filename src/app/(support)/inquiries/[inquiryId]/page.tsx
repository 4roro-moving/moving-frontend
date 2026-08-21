import InquiryDetailClient from "@/components/inquiry/InquiryDetailClient";

interface InquiryDetailPageProps {
  params: Promise<{
    inquiryId: string;
  }>;
}

export default async function InquiryDetailPage({ params }: InquiryDetailPageProps) {
  const { inquiryId } = await params;

  return <InquiryDetailClient inquiryId={Number(inquiryId)} />;
}
