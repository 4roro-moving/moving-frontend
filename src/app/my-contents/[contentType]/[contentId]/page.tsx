import type { Metadata } from "next";

import CustomerAuthGate from "@/components/auth/CustomerAuthGate";
import MyContentDetailPageClient from "@/components/my-content/MyContentDetailPageClient";

export const metadata: Metadata = {
  title: "콘텐츠 처리 안내",
};

export default function MyContentDetailPage() {
  return (
    <CustomerAuthGate loadingMessage="콘텐츠를 불러오는 중입니다.">
      <MyContentDetailPageClient />
    </CustomerAuthGate>
  );
}
