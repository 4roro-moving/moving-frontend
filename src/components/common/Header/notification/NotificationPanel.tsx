"use client";

import { useCallback, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useReadNotification } from "@/hooks/notifications/useReadNotification";
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [knownPageCount, setKnownPageCount] = useState<number | null>(null);
  const [pendingReadIds, setPendingReadIds] = useState<number[]>([]);

  const queryPage = knownPageCount == null ? currentPage : Math.min(currentPage, knownPageCount);

  const { data, isPending, isError, isFetching } = useNotifications({
    page: queryPage,
    limit: NOTIFICATION_PAGE_SIZE,
  });

  const { mutateAsync: markAsRead } = useReadNotification();

  useFocusTrap({
    containerRef: panelRef,
    onEscape: onClose,
    enabled: isVisible,
  });

  const notifications = data?.notifications ?? [];
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
        "border-border-default bg-background-surface rounded-24 shadow-notification absolute top-full right-4 z-50 mt-8 w-87 border px-16 py-10 focus:outline-none md:right-0",
        className,
      )}
    >
      <div className="flex items-center justify-between py-14 pr-12 pl-16 md:pl-24">
        <Text id="notification-panel-title" as="h2" variant={{ base: "2lg-bold", md: "lg-bold" }}>
          알림
        </Text>

        <button
          type="button"
          aria-label="알림 닫기"
          onClick={onClose}
          disabled={!isVisible}
          className="flex size-24 items-center justify-center"
        >
          <CloseIcon className="text-icon-default size-24" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-55 w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            알림을 불러오는 중이에요
          </Text>
        </div>
      ) : isError ? (
        <div className="flex h-55 w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            알림을 불러오지 못했어요
          </Text>
        </div>
      ) : isEmpty ? (
        <div className="flex h-55 w-full items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-subtle text-center">
            새로운 알림이 없습니다
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
