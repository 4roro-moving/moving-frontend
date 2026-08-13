"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useApiMutation } from "@/hooks/queries/useApiMutation";
import {
  buildCreateEstimateRequestPayload,
  createEstimateRequest,
} from "@/lib/api/estimateRequest";
import { getApiError } from "@/lib/api/getApiError";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import type { MoveType } from "@/types/move";

const TOAST_FAILURE_MESSAGE = "견적 요청에 실패했습니다.";
const TOAST_EXISTING_REQUEST_MESSAGE = "견적 요청에 실패했습니다. 기존 견적이 있는지 확인해주세요.";

interface UseCreateEstimateRequestOptions {
  onError?: (message: string) => void;
}

interface SubmitEstimateRequestParams {
  moveType: MoveType;
  moveDate: Date;
  from: AddressSearchItem;
  to: AddressSearchItem;
}

function getCreateEstimateErrorMessage(error: unknown): string {
  const { code } = getApiError(error);

  if (code === "ACTIVE_REQUEST_EXISTS") {
    return TOAST_EXISTING_REQUEST_MESSAGE;
  }

  return TOAST_FAILURE_MESSAGE;
}

export function useCreateEstimateRequest(options?: UseCreateEstimateRequestOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useApiMutation({
    mutationFn: createEstimateRequest,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
          refetchType: "none",
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.MY_LIST_ROOT,
          refetchType: "none",
        }),
      ]);

      if (response) {
        queryClient.setQueryData(QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE, response);
      } else {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE });
      }

      router.replace(APP_ROUTES.ESTIMATES.REQUESTS);
    },
    onError: async (error) => {
      const { code } = getApiError(error);

      if (code === "ACTIVE_REQUEST_EXISTS") {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE });
        return;
      }

      options?.onError?.(getCreateEstimateErrorMessage(error));
    },
  });

  const submitEstimateRequest = (params: SubmitEstimateRequestParams) => {
    mutation.mutate(buildCreateEstimateRequestPayload(params));
  };

  return {
    ...mutation,
    submitEstimateRequest,
  };
}
