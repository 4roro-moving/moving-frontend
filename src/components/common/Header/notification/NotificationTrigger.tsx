"use client";

import { useCallback, useId, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { useUnreadNotificationCount } from "@/hooks/notifications/useUnreadNotificationCount";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AlarmIcon } from "@/icons";

import NotificationPanel from "./NotificationPanel";

export default function NotificationTrigger() {
  const notificationPanelId = useId();
  const { authScope } = useAuthQueryScope();
  // 현재 authScope 와 같을 때만 열린 것으로 간주 → 계정 전환 시 자동으로 닫힘
  const [openScope, setOpenScope] = useState<string | null>(null);
  const isOpen = openScope === authScope;
  const { data } = useUnreadNotificationCount();
  const unreadCount = data?.unreadCount ?? 0;
  const triggerRef = useRef<HTMLButtonElement>(null);

  /** Escape / 닫기 버튼 / 알림 이동 — 트리거로 포커스 복귀 */
  const closeWithFocus = useCallback(() => {
    setOpenScope(null);
    triggerRef.current?.focus();
  }, []);

  /** 바깥 클릭 — 포커스는 클릭한 쪽으로 두고 패널만 닫음 */
  const closeQuiet = useCallback(() => {
    setOpenScope(null);
  }, []);

  const ref = useClickOutside<HTMLDivElement>(closeQuiet);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : "알림"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? notificationPanelId : undefined}
        className="relative flex size-36 items-center justify-center"
        onClick={() => setOpenScope((prev) => (prev === authScope ? null : authScope))}
      >
        <AlarmIcon className="text-icon-subtle size-24 shrink-0 xl:size-32" />
        {unreadCount > 0 ? (
          <Text
            as="span"
            variant="xs-semibold"
            aria-hidden="true"
            className="bg-status-error text-text-inverse absolute -top-4 -right-6 flex h-16 min-w-16 items-center justify-center rounded-full px-4 leading-none"
          >
            {unreadCount}
          </Text>
        ) : null}
      </button>
      {isOpen ? <NotificationPanel id={notificationPanelId} onClose={closeWithFocus} /> : null}
    </div>
  );
}
