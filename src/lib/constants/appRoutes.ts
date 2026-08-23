/**
 * 프론트엔드 페이지 경로 상수
 * API 경로(`API_ROUTES`)와 분리합니다.
 * // 2026.07.25 정슬기 - [추가]
 */
export const APP_ROUTES = {
  /** 홈 */
  HOME: "/",
  LOGIN: "/login",
  /** 기사님(mover) 전용 로그인 */
  MOVER_LOGIN: "/mover/login",
  /** 고객 이메일 회원가입 */
  SIGN_UP: "/signup",
  /** 고객 소셜 회원가입 */
  SOCIAL_SIGN_UP: "/signup/social",
  /** 기사님 이메일 회원가입 */
  MOVER_SIGN_UP: "/mover/signup",
  /** 기사님 소셜 회원가입 */
  MOVER_SOCIAL_SIGN_UP: "/mover/signup/social",
  /** OAuth 인가 code callback — `/oauth/{provider}/callback` */
  OAUTH_CALLBACK: (provider: "google" | "kakao" | "naver") => `/oauth/${provider}/callback`,
  /** 고객 프로필 등록 */
  PROFILE: "/profile",
  /** 기사님 프로필 등록 */
  MOVER_PROFILE: "/mover/profile",
  /** 견적 요청 */
  ESTIMATE_REQUEST: "/estimate-request",
  // 2026.08.20 김나연 - [수정] 고객 내 활동 내역
  MY_ACTIVITY: "/my-activity",
  // 2026.08.22 김나연 - [추가] 내가 작성한 나눔글
  MY_ACTIVITY_GIVEAWAY: "/my-activity/giveaway",
  // 2026.08.22 김나연 - [추가] 내가 작성한 나눔 신청글
  MY_ACTIVITY_GIVEAWAY_REQUESTS: "/my-activity/giveaway-requests",
  /** 고객 프로필 수정 */
  PROFILE_EDIT: "/profile/edit",
  /** 기사님 프로필 수정 */
  MOVER_PROFILE_EDIT: "/mover/profile/edit",
  /** 기사님 기본정보 수정 */
  MOVER_BASIC_EDIT: "/mover/basic/edit",
  /** 기사님 마이페이지 */
  MOVER_MYPAGE: "/mover/mypage",
  // 2026.07.27 정슬기 - [추가] 기사님 찾기·상세 페이지 경로
  MOVERS: {
    ROOT: "/movers",
    // 2026.08.13 윤소정 - [추가] 고객용 캘린더 (기사 일정 확인)
    CALENDAR: "/movers/calendar",
    // 2026.08.03 윤소정 - [추가] 지도기반 기사님 추천
    MAP: "/movers/map",
    DETAIL: (moverId: string) => `/movers/${moverId}`,
    /** 찜한 기사님 전체 목록 */
    FAVORITES: "/movers/favorites",
  },
  // 2026.07.27 정슬기 - [추가] 고객 리뷰 관리 페이지 경로
  REVIEWS: {
    ROOT: "/reviews",
    WRITABLE: "/reviews/writable",
    ME: "/reviews/me",
  },
  // 2026.08.20 김나연 - [수정] 커뮤니티 경로
  // 거주후기는 공개, 나눔은 (customer)/(protected)에서 RoleGuard로 보호합니다.
  COMMUNITY: {
    ROOT: "/community",
    RESIDENCE_REVIEWS: "/community/residence-reviews",
    GIVEAWAY: "/community/giveaway",
    GIVEAWAY_DETAIL: (giveawayId: number) => `/community/giveaway/${giveawayId}`,
  },
  // 2026.07.30 정슬기 - [추가] 내 견적 관리 페이지 경로
  /** 내 견적 관리 */
  ESTIMATES: {
    ROOT: "/estimates",
    PENDING: "/estimates/pending",
    RECEIVED: "/estimates/received",
    REQUESTS: "/estimates/requests",
    REQUEST_DETAIL: (estimateRequestId: number) => `/estimates/requests/${estimateRequestId}`,
    DETAIL: (estimateId: number) => `/estimates/${estimateId}`,
    PENDING_DETAIL: (estimateId: number) => `/estimates/pending/${estimateId}`,
  },
  /** 기사님 받은 요청 및 내 견적 관리 */
  MOVER_ESTIMATES: {
    /** 기존 헤더 호환용 기본 진입 경로 */
    ROOT: "/estimate/received-requests",
    // 2026.08.13 윤소정 - [추가] 기사 캘린더
    CALENDAR: "/estimate/calendar",
    RECEIVED_REQUESTS: "/estimate/received-requests",
    SENT: "/estimate/sent",
    SENT_DETAIL: (estimateId: number) => `/estimate/sent/${estimateId}`,
    REJECTED: "/estimate/rejected",
  },
  // 2026.08.06 김성현 - [추가] 채팅방 상세 페이지 경로
  CHATS: {
    ROOM: (roomId: number) => `/chats/${roomId}`,
  },

  // 2026.08.16 심현수 - [추가] 약관 공개 페이지 경로
  TERMS: "/terms",

  // 2026.08.22 정슬기 - [추가] 고객지원 관련 페이지 경로
  NOTICES: {
    ROOT: "/notices",
    DETAIL: (noticeId: number) => `/notices/${noticeId}`,
  },

  FAQS: {
    ROOT: "/faqs",
  },

  INQUIRIES: {
    ROOT: "/inquiries",
    DETAIL: (inquiryId: number) => `/inquiries/${inquiryId}`,
  },

  /** AI 예상 견적 */
  PRICE_PREDICTION: "/price-prediction",
} as const;
