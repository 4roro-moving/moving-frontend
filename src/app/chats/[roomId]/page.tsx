import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import ChatRoomPageClient from "@/components/chat/ChatRoomPageClient";
import { parsePositiveIntId } from "@/lib/utils/parsePositiveIntId";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("chat");
  return { title: t("metadata.title"), description: t("metadata.description") };
}

interface ChatRoomPageProps {
  params: Promise<{ roomId: string }>;
}

/**
 * 채팅 알림 클릭 시 roomId로 진입하는 페이지
 * // 2026.08.12 김성현 - [추가] 채팅방 상세 라우트
 */
export default async function ChatRoomPage({ params }: ChatRoomPageProps) {
  const { roomId } = await params;
  const id = parsePositiveIntId(roomId);

  if (id === null) {
    notFound();
  }

  return <ChatRoomPageClient roomId={id} />;
}
