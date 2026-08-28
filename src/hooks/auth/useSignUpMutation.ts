import { signUpCustomer, type LoginResult, type SignUpCustomerInput } from "@/lib/api/auth";
import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 고객 회원가입 — fetchInstance(BFF) + 성공 시 store 세션 반영
 */
export const useSignUpMutation = () => {
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation<LoginResult, SignUpCustomerInput>({
    mutationFn: signUpCustomer,
    onSuccess: (data) => {
      // 가입 직후는 프로필 미완료 — 이전 계정 완료 힌트 덮어쓰기
      saveProfileCompleted(false);
      establishSession(data.user);
    },
  });
};
