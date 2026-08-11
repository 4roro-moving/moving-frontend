"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { subscribeNotificationSse } from "@/lib/api/notificationSse";
import { ensureAccessTokenRefreshed } from "@/lib/auth/refreshAccessToken";
import { getAccessToken } from "@/lib/auth/token";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import { ApiError } from "@/types/api";
import type { UnreadNotificationCountResponse } from "@/types/notification";

const INITIAL_RETRY_DELAY_MS = 1_000;
const MAX_RETRY_DELAY_MS = 30_000;

function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(signal.reason);
      return;
    }

    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(signal.reason);
    };

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

/**
 * 알림 SSE를 구독해 미읽음 뱃지·목록 캐시를 실시간 갱신한다.
 * Authorization이 필요하므로 fetch 기반 구독을 사용한다.
 */
export function useNotificationSse() {
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  useEffect(() => {
    if (!isAuthenticated || !isAuthQueryReady) {
      return;
    }

    const abortController = new AbortController();
    let retryDelayMs = INITIAL_RETRY_DELAY_MS;
    let disposed = false;
    const unreadCountQueryKey = QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT(authScope);
    const listScopeQueryKey = QUERY_KEYS.NOTIFICATIONS.LIST_SCOPE(authScope);

    const handleSseEvent = (eventName: string, data: string) => {
      if (eventName === "notification") {
        try {
          const notification = JSON.parse(data) as {
            isRead?: boolean;
            type?: string;
          };

          if (notification.isRead !== true) {
            queryClient.setQueryData<UnreadNotificationCountResponse>(
              unreadCountQueryKey,
              (current) => ({
                unreadCount: (current?.unreadCount ?? 0) + 1,
              }),
            );
          }

          // 견적 요청 반려 알림일 경우 견적 요청 캐시 무효화
          if (notification.type === "ESTIMATE_REQUEST_REJECTED") {
            void queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ALL,
            });
          }
        } catch {
          // JSON 파싱 실패 시 invalidate로 보정
        }

        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
        void queryClient.invalidateQueries({ queryKey: listScopeQueryKey });
        return;
      }

      if (eventName === "notification-refresh") {
        void queryClient.invalidateQueries({ queryKey: unreadCountQueryKey });
        void queryClient.invalidateQueries({ queryKey: listScopeQueryKey });
      }
    };

    const connectLoop = async () => {
      while (!disposed && !abortController.signal.aborted) {
        try {
          let accessToken = getAccessToken();
          if (!accessToken) {
            accessToken = await ensureAccessTokenRefreshed({ notifyOnFailure: false });
          }

          await subscribeNotificationSse({
            accessToken,
            signal: abortController.signal,
            onEvent: handleSseEvent,
          });

          if (disposed || abortController.signal.aborted) {
            return;
          }

          // 정상 종료(서버 재시작 등) 후에도 지연을 두어 연결 폭주를 막는다
          retryDelayMs = INITIAL_RETRY_DELAY_MS;
          try {
            await sleep(INITIAL_RETRY_DELAY_MS, abortController.signal);
          } catch {
            return;
          }
        } catch (error) {
          if (disposed || abortController.signal.aborted) {
            return;
          }

          if (error instanceof ApiError && error.status === 401) {
            try {
              await ensureAccessTokenRefreshed({ notifyOnFailure: false });
            } catch {
              return;
            }
          }

          try {
            await sleep(retryDelayMs, abortController.signal);
          } catch {
            return;
          }

          retryDelayMs = Math.min(retryDelayMs * 2, MAX_RETRY_DELAY_MS);
        }
      }
    };

    void connectLoop();

    return () => {
      disposed = true;
      abortController.abort();
    };
  }, [authScope, isAuthenticated, isAuthQueryReady, queryClient]);
}
