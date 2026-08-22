import type { Metadata } from "next";

import NoticePageClient from "@/components/notice/NoticePageClient";

export const metadata: Metadata = {
  title: "공지사항 | 무빙",
  description: "무빙 서비스의 주요 소식과 안내를 확인할 수 있습니다.",
};

export default function NoticesPage() {
  return <NoticePageClient />;
}
