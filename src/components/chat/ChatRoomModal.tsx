"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { CloseIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

import ChatActionSheet, { type ChatActionItem, type ChatParticipantRole } from "./ChatActionSheet";
import ChatEstimateEditSheet from "./ChatEstimateEditSheet";

export interface ChatEstimateEditConfig {
  moveDateLabel: string;
  priceLabel: string;
  onChangeDate?: () => void;
  onEditPrice?: () => void;
  onSubmit?: () => boolean | void | Promise<boolean | void>;
  isSubmitting?: boolean;
}

export interface ChatRoomModalProps {
  open: boolean;
  participantRole: ChatParticipantRole;
  participantName: string;
  estimateSummary: string;
  onClose: () => void;
  children?: ReactNode;
  messageValue?: string;
  messagePlaceholder?: string;
  selectedImagePreviewUrl?: string | null;
  selectedImageName?: string;
  isImageSending?: boolean;
  sendDisabled?: boolean;
  composerDisabled?: boolean;
  onMessageChange?: (value: string) => void;
  onClearSelectedImage?: () => void;
  onSendMessage?: () => void;
  actions?: Partial<
    Record<ChatActionItem["id"], Pick<ChatActionItem, "onSelect" | "disabled" | "hidden">>
  >;
  /** 기사 견적 수정 시트에 표시할 값·핸들러 */
  estimateEdit?: ChatEstimateEditConfig;
}

/**
 * 채팅방 모달 공통 UI
 * // 2026.08.07 김성현 - [추가] 채팅 모달과 역할별 + 메뉴 바텀시트 구성
 * // 2026.08.07 김성현 - [수정] 액션 시트를 채팅 모달 내부에서 렌더
 * // 2026.08.07 김성현 - [수정] + 메뉴를 입력바 아래 스택으로 배치해 채팅바와 함께 상승
 * // 2026.08.07 정슬기 - [수정] open prop으로 exit 모션 지원
 * // 2026.08.10 김성현 - [수정] 견적 수정 선택 시 액션 시트를 수정 시트로 교체
 * // 2026.08.19 김성현 - [추가] 채팅 이미지 전송 전 미리보기 영역 추가
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
  selectedImagePreviewUrl,
  selectedImageName,
  isImageSending = false,
  sendDisabled = false,
  composerDisabled = false,
  onMessageChange,
  onClearSelectedImage,
  onSendMessage,
  actions,
  estimateEdit,
}: ChatRoomModalProps) {
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const estimateEditSheetRef = useRef<HTMLDivElement>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const [isEstimateEditSheetOpen, setIsEstimateEditSheetOpen] = useState(false);

  const canUseComposer = open && !composerDisabled;
  const isActionSheetVisible = isActionSheetOpen && canUseComposer && !isEstimateEditSheetOpen;
  const isEstimateEditSheetVisible =
    participantRole === "MOVER" && isEstimateEditSheetOpen && canUseComposer;
  const isBottomSheetOpen = isActionSheetVisible || isEstimateEditSheetVisible;
  const hasSelectedImage = Boolean(selectedImagePreviewUrl);
  const isSendDisabled =
    composerDisabled || sendDisabled || (!messageValue.trim() && !hasSelectedImage);

  const mergedActions: ChatRoomModalProps["actions"] = {
    ...actions,
    "estimate-revision": {
      disabled: actions?.["estimate-revision"]?.disabled || !estimateEdit,
      onSelect: () => {
        if (!estimateEdit) return;
        actions?.["estimate-revision"]?.onSelect?.();
        setIsEstimateEditSheetOpen(true);
      },
    },
  };

  useEffect(() => {
    if (isEstimateEditSheetVisible) {
      estimateEditSheetRef.current?.focus();
    }
  }, [isEstimateEditSheetVisible]);

  const focusMenuButton = () => {
    window.requestAnimationFrame(() => {
      menuButtonRef.current?.focus();
    });
  };

  const handleToggleMenu = () => {
    if (composerDisabled) return;

    if (isEstimateEditSheetOpen) {
      setIsEstimateEditSheetOpen(false);
      return;
    }

    setIsActionSheetOpen((prev) => !prev);
  };

  const handleEstimateEditCancel = () => {
    setIsEstimateEditSheetOpen(false);
    focusMenuButton();
  };

  const handleEstimateEditSubmit = async () => {
    const shouldClose = await estimateEdit?.onSubmit?.();

    if (shouldClose === true) {
      setIsEstimateEditSheetOpen(false);
      focusMenuButton();
    }
  };

  const handleClose = () => {
    setIsActionSheetOpen(false);
    setIsEstimateEditSheetOpen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-label={`${participantName} 채팅방`}
      dismissible={false}
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
        <Modal.Close onClose={handleClose} size="sm" />
      </header>

      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col overflow-hidden px-20 py-20 transition-opacity md:px-24",
          isEstimateEditSheetVisible && "opacity-40",
        )}
      >
        {children ?? (
          <div className="flex h-full items-center justify-center">
            <Text variant="lg-medium" className="text-text-muted">
              대화 내역이 없습니다.
            </Text>
          </div>
        )}
      </div>

      {isEstimateEditSheetVisible ? (
        <ChatEstimateEditSheet
          focusRef={estimateEditSheetRef}
          open={isEstimateEditSheetVisible}
          moveDateLabel={estimateEdit?.moveDateLabel ?? "-"}
          priceLabel={estimateEdit?.priceLabel ?? "-"}
          onChangeDate={estimateEdit?.onChangeDate}
          onEditPrice={estimateEdit?.onEditPrice}
          isSubmitting={estimateEdit?.isSubmitting}
          onCancel={handleEstimateEditCancel}
          onSubmit={() => void handleEstimateEditSubmit()}
        />
      ) : (
        <div className="border-border-subtle shrink-0 border-t">
          {selectedImagePreviewUrl ? (
            <div className="border-border-subtle flex items-center gap-10 border-b px-16 py-12 md:px-20">
              <div className="bg-background-subtle rounded-8 relative size-56 shrink-0 overflow-hidden">
                <Image
                  src={selectedImagePreviewUrl}
                  alt="선택한 채팅 이미지 미리보기"
                  fill
                  sizes="56px"
                  unoptimized
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <Text variant="sm-medium" className="text-text-primary min-w-0 flex-1 truncate">
                {selectedImageName || "선택한 이미지"}
              </Text>
              <button
                type="button"
                className={cn(
                  "text-icon-default hover:bg-background-hover flex size-32 shrink-0 items-center justify-center rounded-full",
                  "disabled:text-text-disabled disabled:cursor-not-allowed disabled:hover:bg-transparent",
                  "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                )}
                aria-label="첨부 이미지 제거"
                disabled={isImageSending}
                onClick={onClearSelectedImage}
              >
                <CloseIcon className="size-18" aria-hidden="true" />
              </button>
            </div>
          ) : null}

          <form
            className="flex items-center gap-8 px-16 py-14 md:px-20"
            onSubmit={(event) => {
              event.preventDefault();
              if (isSendDisabled) return;
              onSendMessage?.();
            }}
          >
            <button
              ref={menuButtonRef}
              type="button"
              className={cn(
                "bg-background-brand text-text-inverse flex size-36 shrink-0 items-center justify-center rounded-full",
                "hover:bg-background-brand-hover disabled:bg-background-disabled disabled:text-text-disabled transition-colors disabled:cursor-not-allowed",
                "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
              )}
              aria-label={isBottomSheetOpen ? "채팅 메뉴 닫기" : "채팅 메뉴 열기"}
              aria-expanded={isBottomSheetOpen}
              disabled={composerDisabled}
              onClick={handleToggleMenu}
            >
              <span className="text-[24px] leading-none" aria-hidden="true">
                +
              </span>
            </button>

            <input
              aria-label="채팅 메시지 입력"
              value={messageValue}
              onChange={(event) => onMessageChange?.(event.target.value)}
              placeholder={hasSelectedImage ? "선택한 이미지를 전송해 주세요" : messagePlaceholder}
              disabled={composerDisabled || hasSelectedImage}
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
        </div>
      )}

      <ChatActionSheet
        open={isActionSheetVisible}
        participantRole={participantRole}
        actions={mergedActions}
        onClose={() => setIsActionSheetOpen(false)}
      />
    </Modal>
  );
}

export default function ChatRoomModal(props: ChatRoomModalProps) {
  return <ChatRoomModalContent {...props} />;
}
