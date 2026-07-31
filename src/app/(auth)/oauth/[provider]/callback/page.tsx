"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

import { Text } from "@/components/common/Text";
import { loginWithOAuth } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  clearOAuthPendingSession,
  isOAuthProvider,
  loadOAuthClientState,
  loadOAuthPendingSession,
} from "@/lib/auth/oauth";
import {
  buildLoginPath,
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { useAuthStore } from "@/stores/useAuthStore";

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
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const run = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const pending = loadOAuthPendingSession();
      const pageAudience: AuthAudience = pending?.role === "MOVER" ? "mover" : "customer";
      const routeProvider = params.provider;

      setLoginHref(buildLoginPath(undefined, pageAudience));

      if (!isOAuthProvider(routeProvider)) {
        setError("지원하지 않는 소셜 로그인입니다.");
        clearOAuthPendingSession();
        return;
      }

      if (!code || !pending) {
        setError("소셜 로그인 정보가 올바르지 않습니다.");
        clearOAuthPendingSession();
        return;
      }

      if (pending.provider !== routeProvider) {
        setError("소셜 로그인 정보가 올바르지 않습니다.");
        clearOAuthPendingSession();
        return;
      }

      if (pending.provider !== "naver") {
        const savedState = loadOAuthClientState();
        if (!state || !savedState || state !== savedState) {
          setError("유효하지 않은 요청입니다.");
          clearOAuthPendingSession();
          return;
        }
      }

      try {
        const result = await loginWithOAuth(pending.provider, {
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
          setError(getAudienceMismatchMessage(pageAudience));
          clearOAuthPendingSession();
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
        router.replace(nextPath);
      } catch (err) {
        setError(getApiErrorMessage(err));
        clearOAuthPendingSession();
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
        <Link href={loginHref} className="text-text-brand underline">
          로그인으로 돌아가기
        </Link>
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
