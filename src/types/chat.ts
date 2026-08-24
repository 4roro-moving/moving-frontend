export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM" | "ESTIMATE_REVISION";

export const CHAT_IMAGE_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const CHAT_IMAGE_MAX_SIZE = 25 * 1024 * 1024; // 25MB

export type ChatImageContentType = (typeof CHAT_IMAGE_CONTENT_TYPES)[number];

export interface ChatParticipant {
  id: string;
  name: string;
  role: "CUSTOMER" | "MOVER";
}

export interface ChatRoom {
  id: number;
  estimateId: number;
  estimateRequestId: number;
  /** 현재 견적 상태에서 채팅 메시지를 보낼 수 있는지 여부 */
  canSendMessage: boolean;
  /** 메시지 전송이 불가할 때 입력창에 안내할 사유 */
  messageDisabledReason: string | null;
  customer: ChatParticipant;
  mover: ChatParticipant;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string | null;
  type: ChatMessageType;
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  sender: ChatParticipant | null;
  revision: ChatEstimateRevision | null;
}

export interface ChatEstimateRevision {
  id: number;
  estimateId: number;
  requesterId: string;
  responderId: string | null;
  previousPrice: number;
  requestedPrice: number;
  previousMoveDate: string;
  requestedMoveDate: string;
  previousComment: string;
  requestedComment: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
  createdAt: string;
  respondedAt: string | null;
}

export interface ChatMessageListParams {
  roomId: number;
  cursor?: string | number | null;
  limit?: number;
}

export interface CreateChatRoomBody {
  estimateId: number;
}

export interface SendChatMessagePayload {
  roomId: number;
  content: string;
  clientMessageId?: string;
}

export interface SendChatImageMessagePayload {
  roomId: number;
  imageKey: string;
  clientMessageId?: string;
}

export interface RequestEstimateRevisionPayload {
  roomId: number;
  requestedMoveDate: string;
  requestedPrice: number;
  requestedComment: string;
  clientMessageId?: string;
}

export interface RespondEstimateRevisionPayload {
  roomId: number;
  revisionId: number;
  response: "APPROVED" | "REJECTED";
  clientMessageId?: string;
}

export interface ChatImageUploadUrlRequest {
  contentType: ChatImageContentType;
  size: number;
}

export interface ChatImageUploadUrlResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface JoinChatRoomPayload {
  roomId: number;
  lastMessageId?: number | null;
}

export interface LeaveChatRoomPayload {
  roomId: number;
}

export interface ChatSocketError {
  code: string;
  message: string;
}

export interface MissedChatMessages {
  messages: ChatMessage[];
  hasMore: boolean;
  nextMessageId: number | null;
}

export interface ChatRoomJoinedPayload {
  room: ChatRoom;
  missedMessages: MissedChatMessages;
}

export type JoinChatRoomAck =
  | ({ ok: true } & ChatRoomJoinedPayload)
  | {
      ok: false;
      error: ChatSocketError;
    };

export type LeaveChatRoomAck =
  | {
      ok: true;
    }
  | {
      ok: false;
      error: ChatSocketError;
    };

export type SendChatMessageAck =
  | {
      ok: true;
      message: ChatMessage;
      clientMessageId?: string;
    }
  | {
      ok: false;
      error: ChatSocketError;
      clientMessageId?: string;
    };

export type SendChatImageMessageAck = SendChatMessageAck;
export type RequestEstimateRevisionAck = SendChatMessageAck;
export type RespondEstimateRevisionAck = SendChatMessageAck;
