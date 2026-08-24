"use client";

import Link from "next/link";

import { Text } from "@/components/common/Text";
import { formatRelativeTime } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { toNotificationHref } from "@/lib/utils/notificationLink";
import type { NotificationItem as NotificationItemType } from "@/types/notification";

import {
  buildNotificationMessageParts,
  type NotificationMessagePart,
} from "./notificationMessages";

const itemInteractiveClassName =
  "hover:bg-background-hover focus-visible:ring-border-brand rounded-8 -mx-8 -my-4 flex w-full flex-col gap-2 px-8 py-4 text-left transition focus-visible:ring-1 focus-visible:outline-none";

interface NotificationItemProps {
  notification: NotificationItemType;
  isPendingRead: boolean;
  showDivider: boolean;
  onActivate: (notification: NotificationItemType) => void;
  onNavigate?: () => void;
}

function getNotificationA11yLabel(
  notification: NotificationItemType,
  messageParts: NotificationMessagePart[],
): string {
  const message = messageParts.map((part) => part.text).join("");
  return notification.isRead ? message : `${message}, 읽지 않음`;
}

function NotificationContent({
  notification,
  messageParts,
}: {
  notification: NotificationItemType;
  messageParts: NotificationMessagePart[];
}) {
  const isRead = notification.isRead;

  return (
    <>
      <p className={isRead ? "text-text-weak" : "text-text-secondary"}>
        <Text as="span" variant="lg-medium">
          {messageParts.map((part, partIndex) => (
            <span
              key={`${notification.id}-${partIndex}`}
              className={cn(
                isRead ? "text-text-weak" : part.highlight ? "text-text-brand" : undefined,
              )}
            >
              {part.text}
            </span>
          ))}
        </Text>
      </p>
      <Text as="p" variant="md-medium" className={isRead ? "text-text-weak" : "text-text-muted"}>
        {formatRelativeTime(notification.createdAt)}
      </Text>
    </>
  );
}

export default function NotificationItem({
  notification,
  isPendingRead,
  showDivider,
  onActivate,
  onNavigate,
}: NotificationItemProps) {
  const messageParts = buildNotificationMessageParts(notification.type, notification.content);
  const a11yLabel = getNotificationA11yLabel(notification, messageParts);

  return (
    <li
      className={cn(
        "flex w-full flex-col gap-2 py-16 md:px-24",
        showDivider && "border-border-default border-b",
      )}
    >
      {notification.linkUrl ? (
        <Link
          href={toNotificationHref(notification.linkUrl)}
          onClick={() => {
            onActivate(notification);
            onNavigate?.();
          }}
          className={itemInteractiveClassName}
          aria-label={a11yLabel}
        >
          <NotificationContent notification={notification} messageParts={messageParts} />
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onActivate(notification)}
          className={itemInteractiveClassName}
          aria-label={a11yLabel}
          disabled={notification.isRead || isPendingRead}
        >
          <NotificationContent notification={notification} messageParts={messageParts} />
        </button>
      )}
    </li>
  );
}
