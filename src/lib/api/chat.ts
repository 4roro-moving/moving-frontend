import fetchInstance from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { CursorPagination } from "@/types/pagination";
import type {
  ChatImageUploadUrlRequest,
  ChatImageUploadUrlResult,
  ChatMessage,
  ChatMessageListParams,
  ChatRoom,
  CreateChatRoomBody,
} from "@/types/chat";

export const CHAT_MESSAGE_PAGE_SIZE = 30;

function buildMessageListQuery({
  roomId,
  cursor,
  limit = CHAT_MESSAGE_PAGE_SIZE,
}: ChatMessageListParams): string {
  const searchParams = new URLSearchParams();

  searchParams.set("limit", String(limit));

  if (cursor !== null && cursor !== undefined) {
    searchParams.set("cursor", String(cursor));
  }

  return `${API_ROUTES.CHATS.MESSAGES(roomId)}?${searchParams.toString()}`;
}

export async function getOrCreateChatRoom(body: CreateChatRoomBody): Promise<ChatRoom> {
  return fetchInstance.post<ChatRoom, CreateChatRoomBody>(API_ROUTES.CHATS.ROOMS, body);
}

export async function getChatRoom(roomId: number): Promise<ChatRoom> {
  return fetchInstance.get<ChatRoom>(API_ROUTES.CHATS.ROOM(roomId));
}

export async function getChatMessages(
  params: ChatMessageListParams,
): Promise<{ data: ChatMessage[]; pagination: CursorPagination }> {
  return fetchInstance.getPaginated<ChatMessage[], CursorPagination>(buildMessageListQuery(params));
}

// 2026.08.18 김성현 - [추가] 채팅 이미지 S3 직접 업로드를 위한 Presigned URL 발급
export async function getChatImageUploadUrl(
  roomId: number,
  body: ChatImageUploadUrlRequest,
): Promise<ChatImageUploadUrlResult> {
  return fetchInstance.post<ChatImageUploadUrlResult, ChatImageUploadUrlRequest>(
    API_ROUTES.CHATS.IMAGE_UPLOAD_URL(roomId),
    body,
  );
}
