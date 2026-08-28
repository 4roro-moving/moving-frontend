"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { ConnectedChatRoomModal } from "@/components/chat/ChatRoomModalContainer";
import { Text } from "@/components/common/Text";
import { useChatRoom } from "@/hooks/useChatRoom";
import { getAccessTokenPayload } from "@/lib/auth/accessTokenPayload";
import { getAccessToken } from "@/lib/auth/token";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";
import type { ChatParticipantRole } from "@/components/chat/ChatActionSheet";
import type { ChatRoom } from "@/types/chat";

interface ChatRoomPageClientProps {
  roomId: number;
}

interface ChatRoomViewMeta {
  participantRole: ChatParticipantRole;
  participantName: string;
}

function resolveCurrentUserId(isAuthenticated: boolean, storeUserId?: string): string | null {
  if (storeUserId) {
    return storeUserId;
  }

  if (!isAuthenticated) {
    return null;
  }

  return getAccessTokenPayload(getAccessToken() ?? "").userId ?? null;
}

function resolveChatRoomViewMeta(room: ChatRoom, currentUserId: string): ChatRoomViewMeta | null {
  if (room.customer.id === currentUserId) {
    return {
      participantRole: "CUSTOMER",
      participantName: room.mover.name,
    };
  }

  if (room.mover.id === currentUserId) {
    return {
      participantRole: "MOVER",
      participantName: room.customer.name,
    };
  }

  return null;
}

function ChatRoomPageState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <main className="bg-background-surface flex min-h-[calc(100dvh-88px)] items-center justify-center px-24">
      <div className="flex flex-col items-center gap-16 text-center">
        <Text as="h1" variant="lg-semibold" className="text-text-primary">
          {message}
        </Text>

        {actionLabel && onAction ? (
          <button
            type="button"
            className={cn(
              "border-border-brand text-text-brand rounded-12 border px-20 py-12",
              "hover:bg-background-brand-muted focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
            )}
            onClick={onAction}
          >
            <Text variant="md-semibold">{actionLabel}</Text>
          </button>
        ) : null}
      </div>
    </main>
  );
}

/**
 * 알림 linkUrl(/chats/:roomId)로 진입하는 채팅방 페이지
 * // 2026.08.12 김성현 - [추가] roomId 기반 채팅방 알림 진입 화면
 */
export default function ChatRoomPageClient({ roomId }: ChatRoomPageClientProps) {
  const t = useTranslations("chat.page");
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const storeUserId = useAuthStore((state) => state.user?.id);
  const currentUserId = resolveCurrentUserId(isAuthenticated, storeUserId);
  const canLoadRoom = roomId > 0 && hasHydrated && isAuthenticated;
  const chatRoom = useChatRoom(roomId, canLoadRoom);
  const room = chatRoom.data;

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(APP_ROUTES.HOME);
  };

  if (!hasHydrated || isCheckingAuth) {
    return <ChatRoomPageState message={t("loading")} />;
  }

  if (!isAuthenticated) {
    return <ChatRoomPageState message={t("loginRequired")} />;
  }

  if (chatRoom.isPending) {
    return <ChatRoomPageState message={t("loading")} />;
  }

  if (chatRoom.isError || !room) {
    return (
      <ChatRoomPageState
        message={t("loadFailed")}
        actionLabel={t("retry")}
        onAction={() => void chatRoom.refetch()}
      />
    );
  }

  if (!currentUserId) {
    return <ChatRoomPageState message={t("checkingUser")} />;
  }

  const viewMeta = resolveChatRoomViewMeta(room, currentUserId);

  if (!viewMeta) {
    return <ChatRoomPageState message={t("forbidden")} />;
  }

  return (
    <ConnectedChatRoomModal
      open
      room={room}
      participantRole={viewMeta.participantRole}
      participantName={viewMeta.participantName}
      estimateSummary={t("estimateSummary", { id: room.estimateId })}
      onClose={handleClose}
    />
  );
}
