"use client";

import { useCallback, useEffect, useId, useState } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { AlarmIcon } from "@/icons";
import { getUnreadNotificationCount, MOCK_NOTIFICATIONS } from "@/lib/mocks/notifications.mock";

import NotificationPanel from "./NotificationPanel";

export default function NotificationTrigger() {
  const notificationPanelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = getUnreadNotificationCount(MOCK_NOTIFICATIONS);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutside<HTMLDivElement>(close);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : "알림"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? notificationPanelId : undefined}
        className="relative"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <AlarmIcon className="text-icon-default size-24" aria-hidden="true" />
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
      {isOpen ? (
        <div id={notificationPanelId}>
          <NotificationPanel onClose={close} />
        </div>
      ) : null}
    </div>
  );
}
