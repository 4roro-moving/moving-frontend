"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Toast/Toast";
import { useGetOrCreateChatRoom } from "@/hooks/useChatRoom";
import { WriteIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface EstimateChatActionProps {
  estimateId: number;
  className?: string;
  buttonClassName?: string;
}

/**
 * 견적 상세 채팅방 진입 CTA
 * // 2026.08.06 김성현 - [추가] 고객·기사 상세 공통 채팅방 생성 및 이동
 */
export default function EstimateChatAction({
  estimateId,
  className,
  buttonClassName,
}: EstimateChatActionProps) {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const chatRoomMutation = useGetOrCreateChatRoom();

  const handleClick = async () => {
    try {
      const room = await chatRoomMutation.mutateAsync({ estimateId });
      router.push(APP_ROUTES.CHATS.ROOM(room.id));
    } catch (error) {
      setToastMessage(getApiErrorMessage(error, "채팅방을 준비하지 못했습니다."));
    }
  };

  return (
    <>
      <div className={cn("flex w-full justify-end", className)}>
        <Button
          variant="outline"
          size="cta"
          className={cn("w-[200px] whitespace-nowrap", buttonClassName)}
          disabled={chatRoomMutation.isPending}
          aria-busy={chatRoomMutation.isPending}
          onClick={() => void handleClick()}
          rightIcon={<WriteIcon className="size-20 shrink-0" aria-hidden="true" />}
        >
          {chatRoomMutation.isPending ? "채팅 준비 중" : "채팅하기"}
        </Button>
      </div>

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </>
  );
}
