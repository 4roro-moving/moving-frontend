import type { Metadata } from "next";

import MyReportsNavigation from "@/components/report/MyReportsNavigation";
import MyReportsPageClient from "@/components/report/MyReportsPageClient";

export const metadata: Metadata = {
  title: "내 신고내역 | 무빙",
  description: "접수한 신고와 처리 상태를 확인할 수 있습니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyReportsPage() {
  return (
    <>
      <MyReportsNavigation />
      <MyReportsPageClient />
    </>
  );
}
