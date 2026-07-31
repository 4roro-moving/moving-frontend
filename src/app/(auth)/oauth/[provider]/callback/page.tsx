"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  clearOAuthPendingSession,
  isOAuthProvider,
  loadOAuthClientState,
  loadOAuthPendingSession,
} from "@/lib/auth/oauth";
import { exchangeOAuthCodeOnce, getCompletedOAuthExchange } from "@/lib/auth/oauthExchange";
import {
  buildLoginPath,
  getAudienceMismatchMessage,
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";

/** Strict remount에도 성공 후처리를 한 번만 수행 */
const finishedExchangeKeys = new Set<string>();

const failOAuthCallback = (message: string, setError: (value: string) => void): void => {
  clearOAuthPendingSession();
  setError(message);
};

const OAuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ provider: string }>();
  const establishSession = useAuthStore((state) => state.establishSession);
  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState<string | null>(null);
  const [loginHref, setLoginHref] = useState(buildLoginPath());
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const run = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const providerError = searchParams.get("error");
      const routeProvider = params.provider;
      const pending = loadOAuthPendingSession();
      const pageAudience: AuthAudience = pending?.role === "MOVER" ? "mover" : "customer";

      setLoginHref(buildLoginPath(undefined, pageAudience));

      if (providerError) {
        failOAuthCallback(
          providerError === "access_denied"
            ? "소셜 로그인이 취소되었습니다."
            : "소셜 로그인에 실패했습니다.",
          setError,
        );
        return;
      }

      if (!isOAuthProvider(routeProvider)) {
        failOAuthCallback("지원하지 않는 소셜 로그인입니다.", setError);
        return;
      }

      if (!code) {
        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      const exchangeKey = `${routeProvider}:${code}`;

      // 성공 후 pending이 지워진 뒤 remount되어도 완료 캐시가 있으면 재처리/오탐 에러 방지
      if (!pending) {
        if (
          getCompletedOAuthExchange(routeProvider, code) ||
          finishedExchangeKeys.has(exchangeKey)
        ) {
          return;
        }
        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      if (pending.provider !== routeProvider) {
        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      if (pending.provider !== "naver") {
        const savedState = loadOAuthClientState();
        if (!state || !savedState || state !== savedState) {
          failOAuthCallback("유효하지 않은 요청입니다.", setError);
          return;
        }
      }

      try {
        const result = await exchangeOAuthCodeOnce(pending.provider, {
          code,
          role: pending.role,
          ...(pending.provider === "naver" && state ? { state } : {}),
        });

        if (finishedExchangeKeys.has(exchangeKey)) {
          return;
        }
        finishedExchangeKeys.add(exchangeKey);

        const resultAudience = getAuthAudienceFromRole(result.user.role);

        if (
          (pending.role === "CUSTOMER" && resultAudience !== "customer") ||
          (pending.role === "MOVER" && resultAudience !== "mover")
        ) {
          await logout();
          failOAuthCallback(getAudienceMismatchMessage(pageAudience), setError);
          return;
        }

        const nextPath = await getPostAuthRedirectPath({
          audience: resultAudience,
          returnPath: pending.returnPath,
          fallbackPath: getRoleHomePath(result.user.role),
        });

        // GuestOnly 밖이므로 postAuthRedirectPath 대신 직접 이동
        establishSession(result.user);
        clearOAuthPendingSession();
        window.history.replaceState(null, "", window.location.pathname);
        router.replace(nextPath);
      } catch (err) {
        failOAuthCallback(getApiErrorMessage(err), setError);
      }
    };

    void run();
  }, [searchParams, params.provider, establishSession, logout, router]);

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-16 px-24">
        <Text as="p" role="alert" variant="md-medium" className="text-text-error text-center">
          {error}
        </Text>
        <Button variant="solid" size="md" onClick={() => router.push(loginHref)}>
          로그인으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-24">
      <Text as="p" variant="md-medium" className="text-text-description">
        로그인 처리 중…
      </Text>
    </div>
  );
};

const OAuthCallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center px-24">
          <Text as="p" variant="md-medium" className="text-text-description">
            로그인 처리 중…
          </Text>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
};

export default OAuthCallbackPage;
