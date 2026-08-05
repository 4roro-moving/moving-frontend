"use client";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useApiQuery } from "@/hooks/queries/useApiQuery";
import { useAuthQueryScope } from "@/hooks/useAuthQueryScope";
import { getChatRoom, getOrCreateChatRoom } from "@/lib/api/chat";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { ChatRoom, CreateChatRoomBody } from "@/types/chat";

export function useChatRoom(roomId: number, enabled = true) {
  const { authScope, isAuthQueryReady } = useAuthQueryScope();

  return useApiQuery({
    queryKey: QUERY_KEYS.CHATS.ROOM(authScope, roomId),
    queryFn: () => getChatRoom(roomId),
    enabled: enabled && isAuthQueryReady,
  });
}

export function useGetOrCreateChatRoom() {
  return useApiMutation<ChatRoom, CreateChatRoomBody>({
    mutationFn: getOrCreateChatRoom,
  });
}
