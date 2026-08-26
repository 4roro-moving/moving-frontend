"use client";

import { useTranslations } from "next-intl";
import type { ComponentType, SVGProps } from "react";

import { Text } from "@/components/common/Text";
import { usePresence } from "@/hooks/usePresence";
import { ConfirmedCheckIcon, GalleryIcon, WriteIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";
import { SHEET_EXIT_DURATION_MS } from "@/lib/utils/uiMotion";

export type ChatParticipantRole = "CUSTOMER" | "MOVER";

export interface ChatActionItem {
  id: "estimate-revision" | "attach-photo" | "confirm-estimate";
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onSelect?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

const CHAT_ACTIONS_BY_ROLE: Record<ChatParticipantRole, ChatActionItem[]> = {
  MOVER: [
    {
      id: "estimate-revision",
      label: "estimateRevision",
      icon: WriteIcon,
    },
    {
      id: "attach-photo",
      label: "attachPhoto",
      icon: GalleryIcon,
    },
  ],
  CUSTOMER: [
    {
      id: "attach-photo",
      label: "attachPhoto",
      icon: GalleryIcon,
    },
    {
      id: "confirm-estimate",
      label: "confirmEstimate",
      icon: ConfirmedCheckIcon,
    },
  ],
};

export interface ChatActionSheetProps {
  open: boolean;
  participantRole: ChatParticipantRole;
  onClose: () => void;
  actions?: Partial<
    Record<ChatActionItem["id"], Pick<ChatActionItem, "onSelect" | "disabled" | "hidden">>
  >;
}

/**
 * 채팅 입력바 아래 액션 메뉴 패널
 * // 2026.08.07 김성현 - [추가] 역할별 채팅 액션 메뉴 공통화
 * // 2026.08.07 김성현 - [수정] 전역 Modal 대신 채팅 모달 내부 시트로 분리
 * // 2026.08.07 김성현 - [수정] 입력바 아래 인라인 패널로 변경 (채팅바와 함께 상승)
 * // 2026.08.18 김성현 - [수정] 미배포 기능 액션 숨김 옵션 추가
 * // 2026.08.19 김성현 - [수정] 시트 닫힘 중 포커스가 aria-hidden 영역에 남지 않도록 처리
 */
export default function ChatActionSheet({
  open,
  participantRole,
  onClose,
  actions,
}: ChatActionSheetProps) {
  const t = useTranslations("chat");
  const { isRendered, isVisible } = usePresence(open, SHEET_EXIT_DURATION_MS);

  if (!isRendered) return null;

  const actionItems = CHAT_ACTIONS_BY_ROLE[participantRole]
    .map((item) => ({
      ...item,
      ...actions?.[item.id],
    }))
    .filter((item) => !item.hidden);

  const handleSelect = (item: ChatActionItem) => {
    if (item.disabled) return;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    onClose();
    item.onSelect?.();
  };

  return (
    <div
      role="region"
      aria-label={t("menuAria")}
      inert={!isVisible ? true : undefined}
      className={cn(
        "border-border-subtle bg-background-surface shrink-0 border-t px-40 pt-16 pb-20",
        "motion-reduce:animate-none",
        isVisible ? "animate-modal-sheet-in" : "animate-modal-sheet-out pointer-events-none",
      )}
    >
      {/* // 2026.08.07 김성현 - [수정] 아이콘 축소 + w-fit 중앙 그룹으로 좌우 여백 확보 */}
      <div className="mx-auto flex w-fit items-start justify-center gap-32">
        {actionItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={cn(
                "flex w-70 shrink-0 flex-col items-center gap-8 bg-transparent",
                "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
                item.disabled && "cursor-not-allowed opacity-40",
              )}
              disabled={item.disabled}
              onClick={() => handleSelect(item)}
            >
              <span className="border-border-brand bg-background-brand-muted text-icon-brand flex size-40 items-center justify-center rounded-full border">
                <Icon className="size-20 [&_path]:fill-current" aria-hidden="true" />
              </span>
              <Text
                as="span"
                variant="sm-semibold"
                className="text-text-primary text-center whitespace-nowrap"
              >
                {t(`actions.${item.label}`)}
              </Text>
            </button>
          );
        })}
      </div>
    </div>
  );
}
