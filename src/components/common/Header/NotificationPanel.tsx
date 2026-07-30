"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { buildNotificationMessageParts } from "@/components/common/Header/notificationMessages";
import { Text } from "@/components/common/Text";
import { useNotifications } from "@/hooks/useNotifications";
import { useReadNotification } from "@/hooks/useReadNotification";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/icons";
import { NOTIFICATION_PAGE_SIZE } from "@/lib/api/notifications";
import { formatRelativeTime } from "@/lib/utils/date";
import type { NotificationItem } from "@/types/notification";
import { cn } from "@/lib/utils/cn";

function NotificationContent({ notification }: { notification: NotificationItem }) {
  const isRead = notification.isRead;
  const messageParts = buildNotificationMessageParts(notification.type, notification.content);

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

interface NotificationPanelProps {
  onClose: () => void;
  className?: string;
}

const pageButtonClassName =
  "flex size-32 items-center justify-center rounded-6 border border-border-dimmed bg-background-surface transition disabled:cursor-not-allowed";

const itemInteractiveClassName =
  "hover:bg-background-hover focus-visible:ring-border-brand rounded-8 -mx-8 -my-4 flex w-full flex-col gap-2 px-8 py-4 text-left transition focus-visible:ring-1 focus-visible:outline-none";

export default function NotificationPanel({ onClose, className }: NotificationPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isPending, isError, isFetching } = useNotifications({
    page: currentPage,
    limit: NOTIFICATION_PAGE_SIZE,
  });
  const { mutate: markAsRead } = useReadNotification();

  const notifications = data?.notifications ?? [];
  const pageCount = Math.max(1, data?.pagination.totalPages ?? 1);
  const safePage = Math.min(currentPage, pageCount);
  const isEmpty = !isPending && !isError && notifications.length === 0;

  const isPrevDisabled = safePage <= 1 || isFetching;
  const isNextDisabled = safePage >= pageCount || isFetching;

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount));
  };

  const handleNotificationActivate = useCallback(
    (notification: NotificationItem) => {
      if (!notification.isRead) {
        markAsRead(notification.id);
      }
    },
    [markAsRead],
  );

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="notification-panel-title"
      aria-busy={isPending || isFetching}
      className={cn(
        "border-border-default bg-background-surface rounded-24 shadow-notification absolute top-full right-0 z-50 mt-8 w-[359px] border px-16 py-10",
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

      {isPending ? (
        <div className="flex h-[220px] w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            알림을 불러오는 중이에요
          </Text>
        </div>
      ) : isError ? (
        <div className="flex h-[220px] w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            알림을 불러오지 못했어요
          </Text>
        </div>
      ) : isEmpty ? (
        <div className="flex h-[220px] w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            새로운 알림이 없습니다
          </Text>
        </div>
      ) : (
        <ul className="flex w-full flex-col">
          {notifications.map((notification, index) => {
            const isLast = index === notifications.length - 1;

            return (
              <li
                key={notification.id}
                className={cn(
                  "flex w-full flex-col gap-2 px-24 py-16",
                  !isLast && "border-border-default border-b",
                )}
              >
                {notification.linkUrl ? (
                  <Link
                    href={notification.linkUrl}
                    onClick={() => {
                      handleNotificationActivate(notification);
                      onClose();
                    }}
                    className={itemInteractiveClassName}
                  >
                    <NotificationContent notification={notification} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNotificationActivate(notification)}
                    className={itemInteractiveClassName}
                    aria-label={
                      notification.isRead ? notification.title : `${notification.title}, 읽지 않음`
                    }
                  >
                    <NotificationContent notification={notification} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {!isPending && !isError && !isEmpty && pageCount > 1 ? (
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
                    disabled={isCurrent || isFetching}
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
