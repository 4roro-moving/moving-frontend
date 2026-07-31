"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useUnreadNotificationCount } from "@/hooks/useUnreadNotificationCount";
import { AlarmIcon } from "@/icons";

import NotificationPanel from "./NotificationPanel";

export default function NotificationTrigger() {
  const notificationPanelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useUnreadNotificationCount();
  const unreadCount = data?.unreadCount ?? 0;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeWithFocus = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, []);

  const closeQuiet = useCallback(() => {
    setIsOpen(false);
  }, []);

  const ref = useClickOutside<HTMLDivElement>(closeQuiet);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeWithFocus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeWithFocus]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={unreadCount > 0 ? `알림, 읽지 않은 알림 ${unreadCount}개` : "알림"}
        aria-expanded={isOpen}
        aria-controls={isOpen ? notificationPanelId : undefined}
        className="relative flex size-36 items-center justify-center"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <AlarmIcon className="text-icon-subtle size-32 shrink-0" />
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
          <NotificationPanel onClose={closeWithFocus} />
        </div>
      ) : null}
    </div>
  );
}
