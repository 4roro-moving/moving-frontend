"use client";

import { useState } from "react";

import { buildNotificationMessageParts } from "@/components/common/Header/notificationMessages";
import { Text } from "@/components/common/Text";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/icons";
import { MOCK_NOTIFICATIONS, NOTIFICATION_PAGE_SIZE } from "@/lib/mocks/notifications.mock";
import type { NotificationItem } from "@/types/notification";
import { cn } from "@/lib/utils/cn";

interface NotificationPanelProps {
  notifications?: NotificationItem[];
  onClose: () => void;
  className?: string;
}

const pageButtonClassName =
  "flex size-32 items-center justify-center rounded-6 border border-border-dimmed bg-background-surface transition disabled:cursor-not-allowed";

export default function NotificationPanel({
  notifications = MOCK_NOTIFICATIONS,
  onClose,
  className,
}: NotificationPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(notifications.length / NOTIFICATION_PAGE_SIZE));
  const safePage = Math.min(currentPage, pageCount);
  const startIndex = (safePage - 1) * NOTIFICATION_PAGE_SIZE;
  const pageItems = notifications.slice(startIndex, startIndex + NOTIFICATION_PAGE_SIZE);

  const isPrevDisabled = safePage <= 1;
  const isNextDisabled = safePage >= pageCount;

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount));
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="notification-panel-title"
      className={cn(
        "border-border-default bg-background-surface rounded-24 absolute top-full right-0 z-50 mt-8 w-[359px] border px-16 py-10 shadow-[2px_2px_8px_0_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between py-14 pr-12 pl-24">
        <Text
          id="notification-panel-title"
          as="h2"
          variant="2lg-bold"
          className="text-text-primary"
        >
          알림
        </Text>
        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          className="text-icon-default flex size-24 items-center justify-center"
        >
          <CloseIcon className="size-18" />
        </button>
      </div>

      <ul className="flex w-full flex-col">
        {pageItems.map((notification, index) => {
          const isLast = index === pageItems.length - 1;
          const isRead = notification.isRead;
          const messageParts = buildNotificationMessageParts(
            notification.type,
            notification.content,
          );

          return (
            <li
              key={notification.id}
              className={cn(
                "flex w-full flex-col gap-2 px-24 py-16",
                !isLast && "border-border-default border-b",
              )}
            >
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
              <Text
                as="p"
                variant="md-medium"
                className={isRead ? "text-text-weak" : "text-text-muted"}
              >
                {notification.createdAtLabel}
              </Text>
            </li>
          );
        })}
      </ul>

      {pageCount > 1 ? (
        <nav
          aria-label="알림 페이지네이션"
          className="flex w-full items-center justify-center py-12"
        >
          <ul className="flex items-center gap-4">
            <li>
              <button
                type="button"
                className={cn(
                  pageButtonClassName,
                  "text-text-secondary hover:bg-background-hover disabled:text-text-weak disabled:hover:bg-transparent",
                )}
                onClick={() => goToPage(safePage - 1)}
                disabled={isPrevDisabled}
                aria-label="이전 페이지"
              >
                <ChevronLeftIcon className="size-16" />
              </button>
            </li>

            {Array.from({ length: pageCount }, (_, index) => {
              const page = index + 1;
              const isCurrent = page === safePage;

              return (
                <li key={page}>
                  <button
                    type="button"
                    className={cn(
                      pageButtonClassName,
                      isCurrent
                        ? "text-text-secondary"
                        : "text-text-weak hover:bg-background-hover cursor-pointer",
                    )}
                    onClick={() => goToPage(page)}
                    disabled={isCurrent}
                    aria-label={`${page} 페이지`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    <Text variant="md-regular">{page}</Text>
                  </button>
                </li>
              );
            })}

            <li>
              <button
                type="button"
                className={cn(
                  pageButtonClassName,
                  "text-text-secondary hover:bg-background-hover disabled:text-text-weak disabled:hover:bg-transparent",
                )}
                onClick={() => goToPage(safePage + 1)}
                disabled={isNextDisabled}
                aria-label="다음 페이지"
              >
                <ChevronRightIcon className="size-16" />
              </button>
            </li>
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
