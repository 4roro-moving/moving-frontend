"use client";

import { useApiInfiniteQuery } from "@/hooks/queries/useApiInfiniteQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getChatMessages, CHAT_MESSAGE_PAGE_SIZE } from "@/lib/api/chat";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

interface UseChatMessagesOptions {
  roomId: number;
  enabled?: boolean;
  limit?: number;
}

export function useChatMessages({
  roomId,
  enabled = true,
  limit = CHAT_MESSAGE_PAGE_SIZE,
}: UseChatMessagesOptions) {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiInfiniteQuery({
    queryKey: QUERY_KEYS.CHATS.MESSAGES(authScope, roomId, limit),
    queryFn: ({ pageParam }) =>
      getChatMessages({
        roomId,
        limit,
        cursor: pageParam,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor ?? undefined,
    enabled: enabled && isAuthQueryReady,
  });
}
