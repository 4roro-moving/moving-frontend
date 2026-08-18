export const API_ROUTES = {
  AUTH: {
    SIGN_UP_CUSTOMER: "/auth/signup/customer",
    SIGN_UP_MOVER: "/auth/signup/mover",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    GOOGLE_LOGIN: "/auth/oauth/google",
    KAKAO_LOGIN: "/auth/oauth/kakao",
    NAVER_LOGIN: "/auth/oauth/naver",
    NAVER_OAUTH_STATE: "/auth/oauth/naver/state",
  },
  USERS: {
    ROOT: "/users",
    ME: "/users/me",
  },
  PROFILES: {
    ROOT: "/profiles",
    IMAGE_UPLOAD_URL: "/profiles/image/upload-url",
    CUSTOMER: "/profiles/customer",
    CUSTOMER_STATUS: "/profiles/customer/status",
    CUSTOMER_ME: "/profiles/customer/me",
    CUSTOMER_BASIC: "/profiles/customer/me/basic",
    MOVER: "/profiles/mover",
    MOVER_STATUS: "/profiles/mover/status",
    MOVER_ME: "/profiles/mover/me",
    MOVER_BASIC: "/profiles/mover/me/basic",
  },
  MOVERS: {
    ROOT: "/movers",
    DETAIL: (moverId: string) => `/movers/${moverId}`,
    REVIEWS: (moverId: string) => `/movers/${moverId}/reviews`,
  },
  ESTIMATE_REQUESTS: {
    ROOT: "/estimate-requests",
    DETAIL: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}`,
    // 2026.08.03 정슬기 - [추가] 견적 요청 soft cancel (DELETE)
    DELETE: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}`,
    ACTIVE: "/estimate-requests/active",
    DESIGNATE: (estimateRequestId: number) => `/estimate-requests/${estimateRequestId}/designate`,
    // 2026.08.07 정슬기 - [추가] 지정 기사 개별 취소
    CANCEL_DESIGNATE: (estimateRequestId: number, moverId: string) =>
      `/estimate-requests/${estimateRequestId}/designate/${moverId}`,
  },
  // 2026.07.24 정슬기 - [추가] 받은 견적 목록·상세·확정 API 경로
  // 2026.07.28 정슬기 - [수정] 대기 중인 견적 목록 경로 추가 (BE GET /estimates/pending)
  ESTIMATES: {
    ROOT: "/estimates",
    REQUESTS: "/estimates/requests",
    SEND: (estimateRequestId: number) => `/estimates/requests/${estimateRequestId}`,
    REJECT: (estimateRequestId: number) => `/estimates/requests/${estimateRequestId}/reject`,
    REJECTIONS: "/estimates/rejections",
    SENT: "/estimates/sent",
    SENT_DETAIL: (estimateId: number) => `/estimates/sent/${estimateId}`,
    COMPLETE_SENT: (estimateId: number) => `/estimates/sent/${estimateId}/complete`,
    PENDING: "/estimates/pending",
    RECEIVED: "/estimates/received",
    DETAIL: (estimateId: number) => `/estimates/${estimateId}`,
    CONFIRM: (estimateId: number) => `/estimates/${estimateId}/confirm`,
  },
  FAVORITES: {
    MOVERS: "/favorites/movers",
    MOVER: (moverId: string) => `/favorites/movers/${moverId}`,
  },
  CHATS: {
    ROOMS: "/chats/rooms",
    ROOM: (roomId: number) => `/chats/rooms/${roomId}`,
    MESSAGES: (roomId: number) => `/chats/rooms/${roomId}/messages`,
    // 2026.08.18 김성현 - [추가] 채팅 이미지 Presigned URL 발급 경로
    IMAGE_UPLOAD_URL: (roomId: number) => `/chats/rooms/${roomId}/images/upload-url`,
  },
  // 2026.07.25 정슬기 - [추가] 리뷰 API 경로
  REVIEWS: {
    ROOT: "/reviews",
    ME: "/reviews/me",
    REVIEWABLE: "/reviews/reviewable",
  },
  NOTIFICATIONS: {
    ROOT: "/notifications",
    UNREAD_COUNT: "/notifications/unread-count",
    READ: (notificationId: number) => `/notifications/${notificationId}/read`,
    READ_ALL: "/notifications/read-all",
    /** GET text/event-stream — Authorization Bearer 필요 */
    SSE_SUBSCRIBE: "/notifications/sse/subscribe",
  },
} as const;
