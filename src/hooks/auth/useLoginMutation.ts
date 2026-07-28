import { login, type LoginInput, type LoginResult } from "@/lib/api/auth";
import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 고객 로그인 — fetchInstance(BFF) + 성공 시 store 세션 반영
 */
export const useLoginMutation = () => {
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation<LoginResult, LoginInput>({
    mutationFn: login,
    onSuccess: (data) => {
      establishSession(data.user);
    },
  });
};
