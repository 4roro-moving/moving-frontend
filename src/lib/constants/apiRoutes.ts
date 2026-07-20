export const API_ROUTES = {
  AUTH: {
    SIGN_UP: "/auth/signup",
    SIGN_IN: "/auth/signin",
    SIGN_OUT: "/auth/signout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
  },
  USERS: "/users",
  PROFILES: "/profiles",
  MOVERS: "/movers",
  ESTIMATE_REQUESTS: "/estimate-requests",
  ESTIMATES: "/estimates",
  REVIEWS: "/reviews",
  NOTIFICATIONS: "/notifications",
} as const;
