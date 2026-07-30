import { login, type LoginInput, type LoginResult } from "@/lib/api/auth";
import { useApiMutation } from "@/hooks/queries/useApiMutation";

/**
 * 로그인 — fetchInstance(BFF).
 * 세션 반영은 audience 검증 후 LoginForm에서 establishSession 호출.
 */
export const useLoginMutation = () => {
  return useApiMutation<LoginResult, LoginInput>({
    mutationFn: login,
  });
};
