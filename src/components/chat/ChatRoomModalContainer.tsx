"use client";

import AutoTranslatedText from "@/components/common/AutoTranslatedText";

import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef, type ChangeEvent } from "react";

import ChatRoomCreateError from "@/components/chat/ChatRoomCreateError";
import ChatRoomModal from "@/components/chat/ChatRoomModal";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import {
  useChatRoomModalController,
  useConnectedChatRoomModalController,
} from "@/hooks/useChatRoomModalController";
import { cn } from "@/lib/utils/cn";
import { CHAT_IMAGE_CONTENT_TYPES } from "@/types/chat";
import type { ChatActionItem, ChatParticipantRole } from "@/components/chat/ChatActionSheet";
import type { ChatEstimateEditConfig } from "@/components/chat/ChatRoomModal";
import type { ChatMessage, ChatRoom } from "@/types/chat";

const IS_CHAT_IMAGE_UPLOAD_ENABLED = process.env.NEXT_PUBLIC_CHAT_IMAGE_UPLOAD_ENABLED === "true";

export interface ChatRoomModalContainerProps {
  open: boolean;
  estimateId: number;
  participantRole: ChatParticipantRole;
  participantName: string;
  estimateSummary: string;
  onClose: () => void;
  actions?: Partial<
    Record<ChatActionItem["id"], Pick<ChatActionItem, "onSelect" | "disabled" | "hidden">>
  >;
  estimateEdit?: ChatEstimateEditConfig;
}

export interface ConnectedChatRoomModalProps extends Omit<
  ChatRoomModalContainerProps,
  "estimateId"
> {
  room: ChatRoom | null;
  roomErrorMessage?: string | null;
  isRoomLoading?: boolean;
  onRetryRoom?: () => void;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  participantRole: ChatParticipantRole;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
  isActionPending: boolean;
  onRespondEstimateRevision: (revisionId: number, response: "APPROVED" | "REJECTED") => void;
}

function ChatMessageList({
  messages,
  participantRole,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
  isActionPending,
  onRespondEstimateRevision,
}: ChatMessageListProps) {
  const t = useTranslations("chat.messages");
  const format = useFormatter();
  const formatMessageTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return Number.isNaN(date.getTime())
      ? ""
      : format.dateTime(date, { hour: "2-digit", minute: "2-digit" });
  };
  const formatRevisionMoveDate = (moveDate: string) => {
    const date = new Date(moveDate);
    return Number.isNaN(date.getTime())
      ? "-"
      : format.dateTime(date, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
  };
  const formatPrice = (price: number) => format.number(price);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const latestMessageId = messages.at(-1)?.id ?? null;
  const previousMessagesButtonLabel = isFetchingNextPage ? t("loadingPrevious") : t("loadPrevious");

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
          {t("loading")}
        </Text>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Text variant="lg-medium" className="text-text-muted">
          {t("empty")}
        </Text>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      role="region"
      aria-label={t("listAria")}
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
            if (message.type === "SYSTEM") {
              return (
                <div key={message.id} className="flex w-full justify-center py-4">
                  <Text
                    as="p"
                    variant="sm-medium"
                    className="bg-background-subtle text-text-muted rounded-12 px-12 py-8 text-center"
                  >
                    <AutoTranslatedText text={message.content} />
                  </Text>
                </div>
              );
            }

            const sender = message.sender;
            const isMine = sender?.role === participantRole;
            const revision = message.revision;
            const canRespondRevision =
              participantRole === "CUSTOMER" &&
              message.type === "ESTIMATE_REVISION" &&
              revision?.status === "PENDING" &&
              !isMine;

            return (
              <div
                key={message.id}
                className={cn("flex w-full flex-col gap-4", isMine ? "items-end" : "items-start")}
              >
                {!isMine ? (
                  <Text variant="sm-medium" className="text-text-muted">
                    {sender?.name ?? t("serviceName")}
                  </Text>
                ) : null}
                <div
                  className={cn(
                    "rounded-16 max-w-[86%] overflow-hidden",
                    isMine
                      ? "bg-background-brand text-text-inverse rounded-br-4"
                      : "bg-background-subtle text-text-primary rounded-bl-4",
                  )}
                >
                  {message.type === "ESTIMATE_REVISION" && revision ? (
                    <div className="flex min-w-240 flex-col gap-12 px-14 py-12">
                      <Text
                        as="p"
                        variant="md-semibold"
                        className={isMine ? "text-text-inverse" : "text-text-primary"}
                      >
                        {t("revisionRequest")}
                      </Text>
                      <div className="flex flex-col gap-6">
                        <Text
                          variant="sm-medium"
                          className={isMine ? "text-text-inverse" : "text-text-secondary"}
                        >
                          {t("moveDate")} {formatRevisionMoveDate(revision.previousMoveDate)} →{" "}
                          {formatRevisionMoveDate(revision.requestedMoveDate)}
                        </Text>
                        <Text
                          variant="sm-medium"
                          className={isMine ? "text-text-inverse" : "text-text-secondary"}
                        >
                          {t("price")} {formatPrice(revision.previousPrice)} →{" "}
                          {formatPrice(revision.requestedPrice)}
                        </Text>
                        <Text
                          as="p"
                          variant="sm-medium"
                          className={cn(
                            "wrap-break-word whitespace-pre-wrap",
                            isMine ? "text-text-inverse" : "text-text-primary",
                          )}
                        >
                          {revision.requestedComment}
                        </Text>
                      </div>

                      {canRespondRevision ? (
                        <div className="flex gap-8">
                          <button
                            type="button"
                            className={cn(
                              "bg-background-surface text-text-brand border-border-brand rounded-10 flex h-36 flex-1 items-center justify-center border",
                              "disabled:bg-background-disabled disabled:text-text-disabled disabled:border-border-disabled disabled:cursor-not-allowed",
                              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                            )}
                            disabled={isActionPending}
                            onClick={() => onRespondEstimateRevision(revision.id, "REJECTED")}
                          >
                            <Text variant="sm-semibold">{t("reject")}</Text>
                          </button>
                          <button
                            type="button"
                            className={cn(
                              "bg-background-brand text-text-inverse rounded-10 flex h-36 flex-1 items-center justify-center",
                              "disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
                              "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                            )}
                            disabled={isActionPending}
                            onClick={() => onRespondEstimateRevision(revision.id, "APPROVED")}
                          >
                            <Text variant="sm-semibold">{t("approve")}</Text>
                          </button>
                        </div>
                      ) : (
                        <Text
                          variant="xs-medium"
                          className={isMine ? "text-text-inverse" : "text-text-muted"}
                        >
                          {t(`revisionStatus.${revision.status}`)}
                        </Text>
                      )}
                    </div>
                  ) : message.type === "IMAGE" && message.imageUrl ? (
                    <Image
                      src={message.imageUrl}
                      alt={t("attachmentAlt")}
                      width={240}
                      height={240}
                      sizes="240px"
                      className="max-h-240 w-full min-w-160 object-cover"
                    />
                  ) : (
                    <Text
                      as="p"
                      variant="md-medium"
                      className={cn(
                        "px-14 py-10 wrap-break-word whitespace-pre-wrap",
                        isMine ? "text-text-inverse" : "text-text-primary",
                      )}
                    >
                      <AutoTranslatedText text={message.content} />
                    </Text>
                  )}
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
  roomErrorMessage,
  isRoomLoading = false,
  onRetryRoom,
  participantRole,
  participantName,
  estimateSummary,
  onClose,
  actions,
  estimateEdit,
}: ConnectedChatRoomModalProps) {
  const t = useTranslations("chat.messages");
  const chat = useConnectedChatRoomModalController({ open, room });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatImageAccept = CHAT_IMAGE_CONTENT_TYPES.join(",");
  const isChatContentReady = room !== null && !chat.isMessagesPending;
  const connectedEstimateEdit = estimateEdit
    ? {
        ...estimateEdit,
        isSubmitting: estimateEdit.isSubmitting || chat.isSending,
        onSubmit: chat.requestEstimateRevision,
      }
    : undefined;

  const mergedActions: ConnectedChatRoomModalProps["actions"] = {
    ...actions,
    "attach-photo": {
      ...actions?.["attach-photo"],
      hidden: actions?.["attach-photo"]?.hidden || !IS_CHAT_IMAGE_UPLOAD_ENABLED,
      disabled:
        actions?.["attach-photo"]?.disabled ||
        chat.isComposerDisabled ||
        chat.isImageSending ||
        !chat.isConnected,
      onSelect: () => {
        actions?.["attach-photo"]?.onSelect?.();
        fileInputRef.current?.click();
      },
    },
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    chat.selectImageFile(file);
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={chatImageAccept}
        className="sr-only"
        tabIndex={-1}
        aria-label={t("attachImageAria")}
        onChange={handleFileChange}
      />

      <ChatRoomModal
        open={open}
        participantRole={participantRole}
        participantName={participantName}
        estimateSummary={estimateSummary}
        messageValue={chat.messageValue}
        selectedImagePreviewUrl={chat.selectedImagePreviewUrl}
        selectedImageName={chat.selectedImageName}
        isImageSending={chat.isImageSending}
        composerDisabled={!isChatContentReady || chat.isComposerDisabled}
        composerDisabledMessage={isChatContentReady ? chat.messageDisabledReason : null}
        messagePlaceholder={
          isChatContentReady && chat.isComposerDisabled ? t("composerDisabled") : undefined
        }
        sendDisabled={chat.sendDisabled}
        onMessageChange={chat.setMessageValue}
        onClearSelectedImage={chat.clearSelectedImage}
        onSendMessage={() => void chat.handleSendMessage()}
        onClose={onClose}
        actions={mergedActions}
        estimateEdit={connectedEstimateEdit}
      >
        {room === null ? (
          roomErrorMessage ? (
            <ChatRoomCreateError
              message={roomErrorMessage}
              isRetrying={isRoomLoading}
              onRetry={onRetryRoom ?? (() => undefined)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Text variant="lg-medium" className="text-text-muted">
                {t("loading")}
              </Text>
            </div>
          )
        ) : chat.isMessagesError ? (
          <div className="flex h-full flex-col items-center justify-center gap-12">
            <Text variant="lg-medium" className="text-text-muted">
              {chat.messagesErrorMessage}
            </Text>
            <button
              type="button"
              className="text-text-brand rounded-12 px-12 py-8"
              onClick={() => void chat.refetchMessages()}
            >
              <Text variant="sm-semibold">{t("retry")}</Text>
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
            isActionPending={chat.isComposerDisabled || chat.isSending || chat.isImageSending}
            onRespondEstimateRevision={(revisionId, response) =>
              void chat.respondEstimateRevision(revisionId, response)
            }
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
 * // 2026.08.18 김성현 - [수정] 채팅 이미지 첨부 액션 feature flag 적용
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

  return (
    <ConnectedChatRoomModal
      open={open}
      room={activeRoom}
      roomErrorMessage={chatRoom.createErrorMessage}
      isRoomLoading={chatRoom.isChatRoomPending}
      onRetryRoom={chatRoom.retryCreateChatRoom}
      participantRole={participantRole}
      participantName={participantName}
      estimateSummary={estimateSummary}
      onClose={onClose}
      actions={actions}
      estimateEdit={estimateEdit}
    />
  );
}
