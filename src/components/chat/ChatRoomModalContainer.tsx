"use client";

import { useEffect, useRef } from "react";

import ChatRoomCreateError from "@/components/chat/ChatRoomCreateError";
import ChatRoomModal from "@/components/chat/ChatRoomModal";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import {
  useChatRoomModalController,
  useConnectedChatRoomModalController,
} from "@/hooks/useChatRoomModalController";
import { cn } from "@/lib/utils/cn";
import type { ChatActionItem, ChatParticipantRole } from "@/components/chat/ChatActionSheet";
import type { ChatEstimateEditConfig } from "@/components/chat/ChatRoomModal";
import type { ChatMessage, ChatRoom } from "@/types/chat";

export interface ChatRoomModalContainerProps {
  open: boolean;
  estimateId: number;
  participantRole: ChatParticipantRole;
  participantName: string;
  estimateSummary: string;
  onClose: () => void;
  actions?: Partial<Record<ChatActionItem["id"], Pick<ChatActionItem, "onSelect" | "disabled">>>;
  estimateEdit?: ChatEstimateEditConfig;
}

export interface ConnectedChatRoomModalProps extends Omit<
  ChatRoomModalContainerProps,
  "estimateId"
> {
  room: ChatRoom;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  participantRole: ChatParticipantRole;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
}

function formatMessageTime(createdAt: string): string {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Seoul",
  }).format(date);
}

function ChatMessageList({
  messages,
  participantRole,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
}: ChatMessageListProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const latestMessageId = messages.at(-1)?.id ?? null;
  const previousMessagesButtonLabel = isFetchingNextPage
    ? "이전 메시지 불러오는 중"
    : "이전 메시지 더보기";

  useEffect(() => {
    if (latestMessageId === null) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      const scrollContainer = scrollContainerRef.current;

      if (!scrollContainer) {
        return;
      }

      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    });

    return () => cancelAnimationFrame(frameId);
  }, [latestMessageId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Text variant="lg-medium" className="text-text-muted">
          대화 내역을 불러오는 중입니다.
        </Text>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Text variant="lg-medium" className="text-text-muted">
          대화 내역이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      role="region"
      aria-label="채팅 메시지 목록"
      tabIndex={0}
      className={cn(
        "h-full min-h-0 overflow-y-auto",
        "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
      )}
    >
      <div className="flex min-h-full flex-col gap-12">
        {hasNextPage ? (
          <button
            type="button"
            className={cn(
              "text-text-brand rounded-12 mx-auto px-12 py-8 transition-colors",
              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              isFetchingNextPage
                ? "text-text-disabled cursor-not-allowed"
                : "hover:bg-background-brand-muted",
            )}
            disabled={isFetchingNextPage}
            aria-busy={isFetchingNextPage}
            onClick={onFetchNextPage}
          >
            <Text variant="sm-semibold">{previousMessagesButtonLabel}</Text>
          </button>
        ) : null}

        <div className="mt-auto flex flex-col gap-12">
          {messages.map((message) => {
            const isMine = message.sender.role === participantRole;

            return (
              <div
                key={message.id}
                className={cn("flex w-full flex-col gap-4", isMine ? "items-end" : "items-start")}
              >
                {!isMine ? (
                  <Text variant="sm-medium" className="text-text-muted">
                    {message.sender.name}
                  </Text>
                ) : null}
                <div
                  className={cn(
                    "rounded-16 max-w-[78%] px-14 py-10",
                    isMine
                      ? "bg-background-brand text-text-inverse rounded-br-4"
                      : "bg-background-subtle text-text-primary rounded-bl-4",
                  )}
                >
                  <Text
                    as="p"
                    variant="md-medium"
                    className={cn(
                      "wrap-break-word whitespace-pre-wrap",
                      isMine ? "text-text-inverse" : "text-text-primary",
                    )}
                  >
                    {message.content}
                  </Text>
                </div>
                <Text variant="xs-medium" className="text-text-muted">
                  {formatMessageTime(message.createdAt)}
                </Text>
              </div>
            );
          })}

          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export function ConnectedChatRoomModal({
  open,
  room,
  participantRole,
  participantName,
  estimateSummary,
  onClose,
  actions,
  estimateEdit,
}: ConnectedChatRoomModalProps) {
  const chat = useConnectedChatRoomModalController({ open, room });

  return (
    <>
      <ChatRoomModal
        open={open}
        participantRole={participantRole}
        participantName={participantName}
        estimateSummary={estimateSummary}
        messageValue={chat.messageValue}
        sendDisabled={chat.sendDisabled}
        onMessageChange={chat.setMessageValue}
        onSendMessage={() => void chat.handleSendMessage()}
        onClose={onClose}
        actions={actions}
        estimateEdit={estimateEdit}
      >
        {chat.isMessagesError ? (
          <div className="flex h-full flex-col items-center justify-center gap-12">
            <Text variant="lg-medium" className="text-text-muted">
              {chat.messagesErrorMessage}
            </Text>
            <button
              type="button"
              className="text-text-brand rounded-12 px-12 py-8"
              onClick={() => void chat.refetchMessages()}
            >
              <Text variant="sm-semibold">다시 시도</Text>
            </button>
          </div>
        ) : (
          <ChatMessageList
            messages={chat.messages}
            participantRole={participantRole}
            isLoading={chat.isMessagesPending}
            isFetchingNextPage={chat.isFetchingNextPage}
            hasNextPage={chat.hasNextPage}
            onFetchNextPage={() => void chat.fetchNextPage()}
          />
        )}
      </ChatRoomModal>

      {chat.toastMessage ? (
        <Toast onClose={chat.clearToastMessage}>{chat.toastMessage}</Toast>
      ) : null}
    </>
  );
}

/**
 * 채팅방 생성/조회, 메시지 목록, 소켓 연결을 묶는 채팅 모달 컨테이너
 * // 2026.08.07 김성현 - [추가] 견적 상세 채팅 모달 BE 연동
 */
export default function ChatRoomModalContainer({
  open,
  estimateId,
  participantRole,
  participantName,
  estimateSummary,
  onClose,
  actions,
  estimateEdit,
}: ChatRoomModalContainerProps) {
  const chatRoom = useChatRoomModalController({ open, estimateId });
  const activeRoom = chatRoom.activeRoom;

  if (!open) {
    return null;
  }

  if (!activeRoom) {
    return (
      <ChatRoomModal
        open={open}
        participantRole={participantRole}
        participantName={participantName}
        estimateSummary={estimateSummary}
        sendDisabled
        composerDisabled
        onClose={onClose}
        actions={actions}
        estimateEdit={estimateEdit}
      >
        {chatRoom.createErrorMessage ? (
          <ChatRoomCreateError
            message={chatRoom.createErrorMessage}
            isRetrying={chatRoom.isChatRoomPending}
            onRetry={chatRoom.retryCreateChatRoom}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Text variant="lg-medium" className="text-text-muted">
              채팅방을 준비하는 중입니다.
            </Text>
          </div>
        )}
      </ChatRoomModal>
    );
  }

  return (
    <ConnectedChatRoomModal
      open={open}
      room={activeRoom}
      participantRole={participantRole}
      participantName={participantName}
      estimateSummary={estimateSummary}
      onClose={onClose}
      actions={actions}
      estimateEdit={estimateEdit}
    />
  );
}
