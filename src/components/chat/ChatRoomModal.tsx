"use client";

import { useState, type ReactNode } from "react";

import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import ChatActionSheet, { type ChatActionItem, type ChatParticipantRole } from "./ChatActionSheet";

export interface ChatRoomModalProps {
  open: boolean;
  participantRole: ChatParticipantRole;
  participantName: string;
  estimateSummary: string;
  onClose: () => void;
  children?: ReactNode;
  messageValue?: string;
  messagePlaceholder?: string;
  sendDisabled?: boolean;
  composerDisabled?: boolean;
  onMessageChange?: (value: string) => void;
  onSendMessage?: () => void;
  actions?: Partial<Record<ChatActionItem["id"], Pick<ChatActionItem, "onSelect" | "disabled">>>;
}

/**
 * 채팅방 모달 공통 UI
 * // 2026.08.07 김성현 - [추가] 채팅 모달과 역할별 + 메뉴 바텀시트 구성
 * // 2026.08.07 김성현 - [수정] 액션 시트를 채팅 모달 내부에서 렌더
 * // 2026.08.07 김성현 - [수정] + 메뉴를 입력바 아래 스택으로 배치해 채팅바와 함께 상승
 * // 2026.08.07 정슬기 - [수정] open prop으로 exit 모션 지원
 */
function ChatRoomModalContent({
  open,
  participantRole,
  participantName,
  estimateSummary,
  onClose,
  children,
  messageValue = "",
  messagePlaceholder = "메시지를 입력하세요",
  sendDisabled = false,
  composerDisabled = false,
  onMessageChange,
  onSendMessage,
  actions,
}: ChatRoomModalProps) {
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const isActionSheetVisible = isActionSheetOpen && !composerDisabled;
  const isSendDisabled = composerDisabled || sendDisabled || !messageValue.trim();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-label={`${participantName} 채팅방`}
      className={cn(
        "h-[min(720px,calc(100dvh-48px))] w-full max-w-[360px] items-stretch gap-0 overflow-hidden p-0",
        "md:max-w-[480px] xl:max-w-[480px]",
      )}
    >
      <header className="border-border-subtle flex shrink-0 items-center justify-between border-b px-20 py-18 md:px-24 md:py-20">
        <div className="flex min-w-0 items-center gap-12">
          <div
            className="bg-background-brand-muted size-40 shrink-0 rounded-full"
            aria-hidden="true"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <Text as="h2" variant="lg-semibold" className="text-text-primary truncate">
              {participantName}
            </Text>
            <Text variant="sm-medium" className="text-text-brand truncate">
              {estimateSummary}
            </Text>
          </div>
        </div>
        <Modal.Close onClose={onClose} size="sm" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-20 py-20 md:px-24">
        {children ?? (
          <div className="flex h-full items-center justify-center">
            <Text variant="lg-medium" className="text-text-muted">
              대화 내역이 없습니다.
            </Text>
          </div>
        )}
      </div>

      <form
        className="border-border-subtle flex shrink-0 items-center gap-8 border-t px-16 py-14 md:px-20"
        onSubmit={(event) => {
          event.preventDefault();
          if (isSendDisabled) return;
          onSendMessage?.();
        }}
      >
        <button
          type="button"
          className={cn(
            "bg-background-brand text-text-inverse flex size-36 shrink-0 items-center justify-center rounded-full",
            "hover:bg-background-brand-hover disabled:bg-background-disabled disabled:text-text-disabled transition-colors disabled:cursor-not-allowed",
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
          )}
          aria-label={isActionSheetVisible ? "채팅 메뉴 닫기" : "채팅 메뉴 열기"}
          aria-expanded={isActionSheetVisible}
          disabled={composerDisabled}
          onClick={() => {
            if (composerDisabled) return;
            setIsActionSheetOpen((prev) => !prev);
          }}
        >
          <span className="text-[24px] leading-none" aria-hidden="true">
            +
          </span>
        </button>

        <input
          aria-label="채팅 메시지 입력"
          value={messageValue}
          onChange={(event) => onMessageChange?.(event.target.value)}
          placeholder={messagePlaceholder}
          disabled={composerDisabled}
          className={cn(
            "bg-background-subtle text-text-primary h-44 min-w-0 flex-1 rounded-full px-16",
            "placeholder:text-text-muted disabled:bg-background-disabled disabled:text-text-disabled disabled:cursor-not-allowed",
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
          )}
        />

        <button
          type="submit"
          className={cn(
            "bg-background-brand text-text-inverse rounded-12 flex h-44 shrink-0 items-center justify-center px-16",
            "hover:bg-background-brand-hover disabled:bg-background-disabled disabled:text-text-disabled transition-colors disabled:cursor-not-allowed",
            "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
          )}
          disabled={isSendDisabled}
        >
          <Text variant="md-semibold">전송</Text>
        </button>
      </form>

      <ChatActionSheet
        open={isActionSheetVisible}
        participantRole={participantRole}
        actions={actions}
        onClose={() => setIsActionSheetOpen(false)}
      />
    </Modal>
  );
}

export default function ChatRoomModal(props: ChatRoomModalProps) {
  return <ChatRoomModalContent {...props} />;
}
