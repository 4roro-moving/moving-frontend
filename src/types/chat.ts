export type ChatMessageType = "TEXT" | "IMAGE" | "SYSTEM" | "ESTIMATE_REVISION";

export interface ChatParticipant {
  id: string;
  name: string;
  role: "CUSTOMER" | "MOVER";
}

export interface ChatRoom {
  id: number;
  estimateId: number;
  estimateRequestId: number;
  customer: ChatParticipant;
  mover: ChatParticipant;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  roomId: number;
  senderId: string;
  type: ChatMessageType;
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  sender: ChatParticipant;
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

export interface JoinChatRoomPayload {
  roomId: number;
  lastMessageId?: number | null;
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
