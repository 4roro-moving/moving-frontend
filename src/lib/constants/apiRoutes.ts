export const API_ROUTES = {
  AUTH: {
    SIGN_UP_CUSTOMER: "/auth/signup/customer",
    SIGN_UP_MOVER: "/auth/signup/mover",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
  },
  USERS: "/users",
  PROFILES: "/profiles",
  MOVERS: "/movers",
  ESTIMATE_REQUESTS: "/estimate-requests",
  ESTIMATE_REQUEST_ACTIVE: "/estimate-requests/active",
  ESTIMATES: "/estimates",
  REVIEWS: "/reviews",
  NOTIFICATIONS: "/notifications",
} as const;
