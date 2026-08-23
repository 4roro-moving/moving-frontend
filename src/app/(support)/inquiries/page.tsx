import type { Metadata } from "next";

import InquiryPageClient from "@/components/inquiry/InquiryPageClient";

export const metadata: Metadata = {
  title: "1:1 문의 | 무빙",
  description: "무빙 1:1 문의 내역과 답변 상태를 확인할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function InquiriesPage() {
  return <InquiryPageClient />;
}
