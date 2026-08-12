import { signUpMover, type LoginResult, type SignUpMoverInput } from "@/lib/api/auth";
import { useApiMutation } from "@/hooks/queries/useApiMutation";
import { saveProfileCompleted } from "@/lib/auth/profileCompleted";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * 기사 회원가입 — fetchInstance(BFF) + 성공 시 store 세션 반영
 */
export const useSignUpMoverMutation = () => {
  const establishSession = useAuthStore((state) => state.establishSession);

  return useApiMutation<LoginResult, SignUpMoverInput>({
    mutationFn: signUpMover,
    onSuccess: (data) => {
      // 가입 직후는 프로필 미완료 — 이전 계정 완료 힌트 덮어쓰기
      saveProfileCompleted(false);
      establishSession(data.user);
    },
  });
};
