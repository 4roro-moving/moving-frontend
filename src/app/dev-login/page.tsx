"use client";

import { notFound, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import Button from "@/components/common/Button/Button";
import Input from "@/components/common/Input/Input";
import { Text } from "@/components/common/Text";
import { loginWithPassword } from "@/lib/api/devLogin";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { setAccessToken } from "@/lib/auth/token";
import { getDevLoginDefaultEmail, isDevAuthEnabled } from "@/lib/dev-auth";

/**
 * 개발 전용 임시 로그인 페이지
 *
 * 실제 로그인 기능 PR 병합 시 이 파일 전체를 삭제하세요.
 *
 * // 2026.07.24 정슬기 - [추가] 받은 견적 API 연동 확인용 개발 로그인 화면
 */
export default function DevLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(getDevLoginDefaultEmail);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isDevAuthEnabled()) {
    notFound();
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // 2026.07.24 정슬기 - [수정] 공통 auth 토큰 저장소에 accessToken 반영 (refresh는 HttpOnly 쿠키)
      const result = await loginWithPassword({ email, password });
      setAccessToken(result.tokens.accessToken);
      router.replace("/estimates/received");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "로그인에 실패했습니다."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background-subtle flex w-full flex-col items-center px-16 py-64">
      <div className="bg-background-surface border-border-subtle rounded-20 flex w-full max-w-[420px] flex-col gap-32 border p-32">
        <div className="flex flex-col gap-8">
          <Text as="h1" variant="2xl-semibold" className="text-text-primary">
            개발용 로그인
          </Text>
          <Text as="p" variant="md-regular" className="text-text-muted">
            development 환경에서만 사용합니다. 시드 고객 계정으로 로그인한 뒤 받은 견적 API를 확인할
            수 있습니다.
          </Text>
        </div>

        <form className="flex flex-col gap-20" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-8">
            <Text as="span" variant="md-medium" className="text-text-secondary">
              이메일
            </Text>
            <Input
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="customer1@test.com"
            />
          </label>

          <label className="flex flex-col gap-8">
            <Text as="span" variant="md-medium" className="text-text-secondary">
              비밀번호
            </Text>
            <Input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="시드 공통 비밀번호"
            />
          </label>

          {errorMessage ? (
            <Text as="p" variant="md-regular" className="text-text-error" role="alert">
              {errorMessage}
            </Text>
          ) : null}

          <Button type="submit" variant="solid" size="sm" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </div>
    </div>
  );
}
