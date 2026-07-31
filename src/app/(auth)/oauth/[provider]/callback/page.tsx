"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { Text } from "@/components/common/Text";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  clearOAuthPendingSession,
  isOAuthProvider,
  loadOAuthClientState,
  loadOAuthPendingSession,
} from "@/lib/auth/oauth";
import { exchangeOAuthCodeOnce } from "@/lib/auth/oauthExchange";
import {
  buildLoginPath,
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";
import Button from "@/components/common/Button/Button";

const failOAuthCallback = (message: string, setError: (value: string) => void): void => {
  clearOAuthPendingSession();
  setError(message);
};

const getAudienceMismatchMessage = (pageAudience: AuthAudience): string => {
  switch (pageAudience) {
    case "customer":
      return "기사님 계정입니다. 기사님 전용 로그인을 이용해 주세요.";
    case "mover":
      return "일반 유저 계정입니다. 일반 유저 로그인을 이용해 주세요.";
    case "admin":
      return "관리자 계정입니다. 관리자 로그인을 이용해 주세요.";
  }
};

const OAuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ provider: string }>();
  const establishSession = useAuthStore((state) => state.establishSession);
  const setPostAuthRedirectPath = useAuthStore((state) => state.setPostAuthRedirectPath);
  const logout = useAuthStore((state) => state.logout);
  const [error, setError] = useState<string | null>(null);
  const [loginHref, setLoginHref] = useState(buildLoginPath());

  useEffect(() => {
    const run = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const providerError = searchParams.get("error");
      const pending = loadOAuthPendingSession();
      const pageAudience: AuthAudience = pending?.role === "MOVER" ? "mover" : "customer";
      const routeProvider = params.provider;

      if (providerError) {
        failOAuthCallback(
          providerError === "access_denied"
            ? "소셜 로그인이 취소되었습니다."
            : "소셜 로그인에 실패했습니다.",
          setError,
        );
        return;
      }

      if (!code || !pending) {
        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      setLoginHref(buildLoginPath(undefined, pageAudience));

      if (!isOAuthProvider(routeProvider)) {
        failOAuthCallback("지원하지 않는 소셜 로그인입니다.", setError);
        return;
      }

      if (!code || !pending) {
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
        // Strict Mode remount 시 동일 code는 1회만 교환 (모듈 단위 single-flight)
        const result = await exchangeOAuthCodeOnce(pending.provider, {
          code,
          role: pending.role,
          ...(pending.provider === "naver" && state ? { state } : {}),
        });

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

        setPostAuthRedirectPath(nextPath);
        establishSession(result.user);
        clearOAuthPendingSession();
        // 인증 코드가 히스토리에 남지 않도록 callback URL 정리 후 이동
        window.history.replaceState(null, "", window.location.pathname);
        router.replace(nextPath);
      } catch (err) {
        failOAuthCallback(getApiErrorMessage(err), setError);
      }
    };

    void run();
  }, [searchParams, params.provider, establishSession, setPostAuthRedirectPath, logout, router]);

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
