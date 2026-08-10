"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import OAuthLayout from "@/components/auth/OAuthLayout";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  clearOAuthPendingSession,
  isOAuthProvider,
  consumeOAuthClientState,
  loadOAuthPendingSession,
} from "@/lib/auth/oauth";
import {
  exchangeOAuthCodeOnce,
  getCompletedOAuthExchange,
  isOAuthExchangeFinished,
  isOAuthExchangePending,
  markOAuthExchangeFinished,
} from "@/lib/auth/oauthExchange";
import { clearProfileCompleted } from "@/lib/auth/profileCompleted";
import {
  buildLoginPath,
  getAudienceMismatchMessage,
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";
import { resolveAuthUserImage } from "@/lib/api/profile";

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

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const providerError = searchParams.get("error");
      const routeProvider = params.provider;
      const pending = loadOAuthPendingSession();
      const pageAudience: AuthAudience = pending
        ? getAuthAudienceFromRole(pending.role)
        : "customer";

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

      // 성공 후 pending이 지워진 뒤 remount되어도 완료 캐시가 있으면 재처리/오탐 에러 방지
      if (!pending) {
        if (
          getCompletedOAuthExchange(routeProvider, code) ||
          isOAuthExchangeFinished(routeProvider, code)
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

      // 검증 직후 await 전에 동기 소비 — 동일 state 재사용 차단
      if (!consumeOAuthClientState(state)) {
        if (isOAuthExchangeFinished(routeProvider, code)) {
          return;
        }
        if (
          !getCompletedOAuthExchange(routeProvider, code) &&
          !isOAuthExchangePending(routeProvider, code)
        ) {
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

        const resultAudience = getAuthAudienceFromRole(result.user.role);

        // LoginForm과 동일: audience 불일치 시 세션 롤백
        if (resultAudience !== pageAudience) {
          await logout();
          failOAuthCallback(getAudienceMismatchMessage(pageAudience, resultAudience), setError);
          return;
        }

        // mismatch 통과 후에만 후처리 1회 확정
        if (!markOAuthExchangeFinished(pending.provider, code)) {
          return;
        }

        // 이전 계정 Soft UX 힌트 제거 후 status로 다시 저장
        clearProfileCompleted();

        const nextPath = await getPostAuthRedirectPath({
          audience: resultAudience,
          returnPath: pending.returnPath,
          fallbackPath: getRoleHomePath(result.user.role),
        });

        // GuestOnly 밖이므로 postAuthRedirectPath 대신 직접 이동
        establishSession(await resolveAuthUserImage(result.user));
        clearOAuthPendingSession();
        window.history.replaceState(null, "", window.location.pathname);
        router.replace(nextPath);
      } catch (err) {
        failOAuthCallback(getApiErrorMessage(err), setError);
      }
    };

    void run();
  }, [searchParams, params.provider, establishSession, logout, router]);

  return <OAuthLayout error={error} loginHref={loginHref} />;
};

const OAuthCallbackPage = () => {
  return (
    <Suspense fallback={<OAuthLayout loginHref={buildLoginPath()} />}>
      <OAuthCallbackContent />
    </Suspense>
  );
};

export default OAuthCallbackPage;
