"use client";

import { useTranslations } from "next-intl";
import { useCallback, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useReadAllNotifications } from "@/hooks/notifications/useReadAllNotifications";
import { useReadNotification } from "@/hooks/notifications/useReadNotification";
import { useUnreadNotificationCount } from "@/hooks/notifications/useUnreadNotificationCount";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon } from "@/icons";
import { NOTIFICATION_PAGE_SIZE } from "@/lib/api/notifications";
import { cn } from "@/lib/utils/cn";
import type { NotificationItem as NotificationItemType } from "@/types/notification";

import NotificationItem from "./NotificationItem";
import NotificationPagination from "./NotificationPagination";

interface NotificationPanelProps {
  id: string;
  onClose: () => void;
  className?: string;
  isVisible: boolean;
}

export default function NotificationPanel({
  id,
  onClose,
  className,
  isVisible,
}: NotificationPanelProps) {
  const t = useTranslations("notifications");
  const panelRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [knownPageCount, setKnownPageCount] = useState<number | null>(null);
  const [pendingReadIds, setPendingReadIds] = useState<number[]>([]);

  const queryPage = knownPageCount == null ? currentPage : Math.min(currentPage, knownPageCount);

  const { data, isPending, isError, isFetching } = useNotifications({
    page: queryPage,
    limit: NOTIFICATION_PAGE_SIZE,
    enabled: isVisible,
  });

  const { mutateAsync: markAsRead } = useReadNotification();
  const { mutateAsync: markAllAsRead, isPending: isMarkAllPending } = useReadAllNotifications();
  const { data: unreadCountData } = useUnreadNotificationCount({ enabled: isVisible });

  useFocusTrap({
    containerRef: panelRef,
    onEscape: onClose,
    enabled: isVisible,
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = unreadCountData?.unreadCount ?? 0;
  const canMarkAllAsRead = unreadCount > 0 && !isMarkAllPending;
  const totalPagesFromData = data?.pagination.totalPages;
  const pageCount = Math.max(1, totalPagesFromData ?? knownPageCount ?? 1);

  // 서버 totalPages가 줄면 요청/표시 페이지를 함께 보정한다
  if (totalPagesFromData != null) {
    const nextPageCount = Math.max(1, totalPagesFromData);

    if (knownPageCount !== nextPageCount) {
      setKnownPageCount(nextPageCount);
    }

    if (currentPage > nextPageCount) {
      setCurrentPage(nextPageCount);
    }
  }

  const isPageOutOfRange = data != null && currentPage > pageCount;
  const isEmpty = !isPending && !isError && !isPageOutOfRange && notifications.length === 0;
  const isLoading = isPending || isPageOutOfRange;

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), pageCount));
  };

  const handleNotificationActivate = useCallback(
    async (notification: NotificationItemType) => {
      if (notification.isRead || pendingReadIds.includes(notification.id)) {
        return;
      }

      setPendingReadIds((prev) => [...prev, notification.id]);

      try {
        await markAsRead(notification.id);
      } catch {
        // onError에서 캐시 롤백 처리 — 호출부 unhandled rejection만 막는다
      } finally {
        setPendingReadIds((prev) => prev.filter((id) => id !== notification.id));
      }
    },
    [markAsRead, pendingReadIds],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!canMarkAllAsRead) {
      return;
    }

    try {
      await markAllAsRead();
    } catch {
      // onError에서 캐시 롤백 처리 — 호출부 unhandled rejection만 막는다
    }
  }, [canMarkAllAsRead, markAllAsRead]);

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal={isVisible ? "true" : undefined}
      aria-hidden={!isVisible}
      aria-labelledby="notification-panel-title"
      aria-busy={isLoading || isFetching}
      inert={!isVisible ? true : undefined}
      tabIndex={isVisible ? -1 : undefined}
      className={cn(
        "border-border-default bg-background-surface rounded-24 shadow-notification absolute top-full right-6 z-50 mt-8 w-[min(348px,calc(100vw-48px))] border px-16 py-10 focus:outline-none md:right-0 md:w-87",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-8 py-14 pr-12 md:pl-24">
        <Text id="notification-panel-title" as="h2" variant={{ base: "2lg-bold", md: "lg-bold" }}>
          {t("title")}
        </Text>

        <div className="flex shrink-0 items-center gap-8">
          <button
            type="button"
            onClick={() => {
              void handleMarkAllAsRead();
            }}
            disabled={!isVisible || !canMarkAllAsRead}
            className="text-text-brand disabled:text-text-weak focus-visible:ring-border-brand rounded-4 px-2 py-2 focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed"
          >
            <Text as="span" variant={{ base: "lg-regular", md: "md-regular" }}>
              {t("markAllRead")}
            </Text>
          </button>

          <button
            type="button"
            aria-label={t("closeAria")}
            onClick={onClose}
            disabled={!isVisible}
            className="flex size-24 items-center justify-center"
          >
            <CloseIcon className="text-icon-default size-24" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-55 w-full items-center justify-center md:px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            {t("loading")}
          </Text>
        </div>
      ) : isError ? (
        <div className="flex h-55 w-full items-center justify-center md:px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            {t("loadFailed")}
          </Text>
        </div>
      ) : isEmpty ? (
        <div className="flex h-55 w-full items-center justify-center md:px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            {t("empty")}
          </Text>
        </div>
      ) : (
        <ul className="flex w-full flex-col">
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              isPendingRead={pendingReadIds.includes(notification.id)}
              showDivider={index !== notifications.length - 1}
              onActivate={handleNotificationActivate}
              onNavigate={onClose}
            />
          ))}
        </ul>
      )}

      {!isLoading && !isError && !isEmpty && pageCount > 1 ? (
        <NotificationPagination
          pageCount={pageCount}
          currentPage={Math.min(currentPage, pageCount)}
          isFetching={isFetching}
          onChangePage={goToPage}
        />
      ) : null}
    </div>
  );
}
