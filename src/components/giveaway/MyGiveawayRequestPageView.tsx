"use client";

import { useCallback, useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import GiveawayRequestCancelConfirmModal from "@/components/giveaway/GiveawayRequestCancelConfirmModal";
import GiveawayRequestEditModal from "@/components/giveaway/GiveawayRequestEditModal";
import MyGiveawayRequestFilters from "@/components/giveaway/MyGiveawayRequestFilters";
import MyGiveawayRequestListView from "@/components/giveaway/MyGiveawayRequestListView";
import { useCancelGiveawayRequest } from "@/hooks/giveaway/useCancelGiveawayRequest";
import { useMyGiveawayRequests } from "@/hooks/giveaway/useMyGiveawayRequests";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import {
  hasActiveGiveawayRequestFilters,
  type GiveawayRequestFilterState,
} from "@/lib/utils/giveawayRequestSearchParams";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface MyGiveawayRequestPageViewProps {
  filters: GiveawayRequestFilterState;
}

const MyGiveawayRequestPageView = ({ filters }: MyGiveawayRequestPageViewProps) => {
  const { requests, isInitialLoading, isFilterFetching, query } = useMyGiveawayRequests(filters);
  const cancelMutation = useCancelGiveawayRequest();
  const [requestToEdit, setRequestToEdit] = useState<MyGiveawayRequestItem | null>(null);
  const [requestToCancel, setRequestToCancel] = useState<MyGiveawayRequestItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleConfirmCancel = useCallback(() => {
    if (!requestToCancel) {
      return;
    }

    cancelMutation.mutate(requestToCancel.id, {
      onSuccess: () => {
        setRequestToCancel(null);
        setToastMessage("나눔 신청을 취소했습니다.");
      },
      onError: (error) => {
        setToastMessage(
          getApiErrorMessage(error, "나눔 신청을 취소하지 못했습니다. 잠시 후 다시 시도해주세요."),
        );
      },
    });
  }, [cancelMutation, requestToCancel]);

  return (
    <div className="bg-background-subtle flex w-full flex-col items-center">
      <Text as="h1" variant="2xl-bold" className="sr-only">
        내가 작성한 나눔 신청글
      </Text>

      <div className="px-margin-mobile md:px-margin-tablet max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-24 pt-40 pb-60 md:pb-52 xl:px-0 xl:pt-54 xl:pb-200">
        <MyGiveawayRequestFilters filters={filters} />
        <MyGiveawayRequestListView
          requests={requests}
          isInitialLoading={isInitialLoading}
          isFilterFetching={isFilterFetching}
          hasActiveFilters={hasActiveGiveawayRequestFilters(filters)}
          query={query}
          onEdit={setRequestToEdit}
          onCancel={setRequestToCancel}
        />
      </div>

      <GiveawayRequestEditModal
        open={requestToEdit !== null}
        request={requestToEdit}
        onClose={() => setRequestToEdit(null)}
        onSuccess={() => setToastMessage("신청 내용을 수정했습니다.")}
      />

      <GiveawayRequestCancelConfirmModal
        open={requestToCancel !== null}
        request={requestToCancel}
        isPending={cancelMutation.isPending}
        onClose={() => setRequestToCancel(null)}
        onConfirm={handleConfirmCancel}
      />

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </div>
  );
};

export default MyGiveawayRequestPageView;
