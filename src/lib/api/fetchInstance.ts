/**
 * fetch 인스턴스 정의
 * axios 대신 fetch 사용
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TIMEOUT_MS = 10_000;

const fetchInstance = (path: string, options: RequestInit = {}) =>
  fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // withCredentials: true
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS), // timeout: 10_000
  });

export default fetchInstance;
