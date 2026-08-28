import { login, type LoginInput, type LoginResult } from "@/lib/api/auth";
import { useApiMutation } from "@/hooks/queries/useApiMutation";

/**
 * 로그인 — fetchInstance(BFF).
 * 세션 반영은 LoginForm에서 establishSession 호출.
 * role 불일치는 BE가 토큰 발급 전에 거부한다.
 */
export const useLoginMutation = () => {
  return useApiMutation<LoginResult, LoginInput>({
    mutationFn: login,
  });
};
