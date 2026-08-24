"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import OAuthLayout from "@/components/auth/OAuthLayout";
import type { AuthUser, LoginResult } from "@/lib/api/auth";
import { getApiError } from "@/lib/api/getApiError";
import { resolveAuthUserImage } from "@/lib/api/profile";
import { getLoginErrorMessage } from "@/lib/auth/getLoginErrorMessage";
import {
  clearOAuthPendingSession,
  consumeOAuthClientState,
  isOAuthProvider,
  loadOAuthPendingSession,
  type OAuthProvider,
} from "@/lib/auth/oauth";
import {
  markOAuthNeedSignUpToast,
  markOAuthTermsRequiredToast,
} from "@/lib/auth/oauthNeedSignUpToast";
import {
  clearOAuthExchangeFinished,
  exchangeOAuthCodeOnce,
  getCompletedOAuthExchange,
  isOAuthExchangeFinished,
  isOAuthExchangePending,
  markOAuthExchangeFinished,
} from "@/lib/auth/oauthExchange";
import { clearProfileCompleted } from "@/lib/auth/profileCompleted";
import {
  buildLoginPath,
  getAuthAudienceFromRole,
  getPostAuthRedirectPath,
  getRoleHomePath,
  getSocialSignUpPath,
  type AuthAudience,
} from "@/lib/auth/redirect";
import { ERROR_CODES } from "@/lib/constants/errorCodes";
import { useAuthStore } from "@/stores/useAuthStore";

const failOAuthCallback = (message: string, setError: (value: string) => void): void => {
  clearOAuthPendingSession();
  setError(message);
};

interface FinalizeOAuthCallbackParams {
  result: LoginResult;
  returnPath?: string | null;
  provider: OAuthProvider;
  code: string;
  establishSession: (user: AuthUser) => void;
  router: ReturnType<typeof useRouter>;
}

const finalizeOAuthCallback = async ({
  result,
  returnPath,
  provider,
  code,
  establishSession,
  router,
}: FinalizeOAuthCallbackParams): Promise<void> => {
  if (!markOAuthExchangeFinished(provider, code)) {
    return;
  }

  try {
    clearProfileCompleted();

    const resultAudience = getAuthAudienceFromRole(result.user.role);
    const nextPath = await getPostAuthRedirectPath({
      audience: resultAudience,
      returnPath,
      fallbackPath: getRoleHomePath(result.user.role),
    });

    establishSession(await resolveAuthUserImage(result.user));
    clearOAuthPendingSession();
    window.history.replaceState(null, "", window.location.pathname);
    router.replace(nextPath);
  } catch (error) {
    clearOAuthExchangeFinished(provider, code);
    throw error;
  }
};

const OAuthCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ provider: string }>();
  const establishSession = useAuthStore((state) => state.establishSession);
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

      if (!pending) {
        if (isOAuthExchangeFinished(routeProvider, code)) {
          return;
        }

        const completed = getCompletedOAuthExchange(routeProvider, code);
        if (completed) {
          try {
            await finalizeOAuthCallback({
              result: completed,
              returnPath: null,
              provider: routeProvider,
              code,
              establishSession,
              router,
            });
          } catch (err) {
            failOAuthCallback(
              getLoginErrorMessage(err, getAuthAudienceFromRole(completed.user.role)),
              setError,
            );
          }
          return;
        }

        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      if (pending.provider !== routeProvider) {
        failOAuthCallback("소셜 로그인 정보가 올바르지 않습니다.", setError);
        return;
      }

      if (pending.intent !== "login" && pending.intent !== "signup") {
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
          intent: pending.intent,
          ...(pending.agreements ? { agreements: pending.agreements } : {}),
          ...(pending.provider === "naver" && state ? { state } : {}),
        });

        await finalizeOAuthCallback({
          result,
          returnPath: pending.returnPath,
          provider: pending.provider,
          code,
          establishSession,
          router,
        });
      } catch (err) {
        const apiError = getApiError(err);

        if (
          apiError.code === ERROR_CODES.OAUTH_ACCOUNT_NOT_FOUND.code &&
          pending.intent === "login"
        ) {
          markOAuthNeedSignUpToast();
          clearOAuthPendingSession();
          router.replace(getSocialSignUpPath(pageAudience));
          return;
        }

        if (apiError.code === ERROR_CODES.TERMS_AGREEMENT_REQUIRED.code) {
          markOAuthTermsRequiredToast();
          clearOAuthPendingSession();
          router.replace(getSocialSignUpPath(pageAudience));
          return;
        }

        if (apiError.code === ERROR_CODES.OAUTH_EMAIL_ALREADY_EXISTS.code) {
          failOAuthCallback(
            apiError.message ?? ERROR_CODES.OAUTH_EMAIL_ALREADY_EXISTS.message,
            setError,
          );
          return;
        }

        failOAuthCallback(getLoginErrorMessage(err, pageAudience), setError);
      }
    };

    void run();
  }, [searchParams, params.provider, establishSession, router]);

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
