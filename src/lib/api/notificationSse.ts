import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;

export type NotificationSseEventName = "connected" | "notification" | "notification-refresh";

export interface SubscribeNotificationSseParams {
  accessToken: string;
  signal: AbortSignal;
  onEvent: (eventName: NotificationSseEventName | string, data: string) => void;
}

/**
 * fetch 기반 SSE 구독.
 * 브라우저 EventSource는 Authorization 헤더를 넣을 수 없어 fetch 스트림을 사용한다.
 * 장시간 연결이므로 fetchInstance(타임아웃 있음)를 쓰지 않는다.
 */
export async function subscribeNotificationSse(
  params: SubscribeNotificationSseParams,
): Promise<void> {
  if (!API_BASE_URL) {
    throw new Error("API base URL이 설정되지 않았습니다.");
  }

  const response = await fetch(`${API_BASE_URL}${API_ROUTES.NOTIFICATIONS.SSE_SUBSCRIBE}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      Accept: "text/event-stream",
    },
    credentials: "include",
    cache: "no-store",
    signal: params.signal,
  });

  if (!response.ok) {
    throw new ApiError(`SSE 연결 실패 (${String(response.status)})`, response.status);
  }

  if (!response.body) {
    throw new Error("SSE 응답 본문이 없습니다.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let eventName = "message";
  let dataLines: string[] = [];

  const flushEvent = () => {
    if (dataLines.length === 0) {
      eventName = "message";
      return;
    }

    params.onEvent(eventName, dataLines.join("\n"));
    eventName = "message";
    dataLines = [];
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      flushEvent();
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line === "") {
        flushEvent();
        continue;
      }

      // heartbeat 등 SSE comment
      if (line.startsWith(":")) {
        continue;
      }

      if (line.startsWith("event:")) {
        eventName = line.slice("event:".length).trim();
        continue;
      }

      if (line.startsWith("data:")) {
        dataLines.push(line.slice("data:".length).trimStart());
      }
    }
  }
}
