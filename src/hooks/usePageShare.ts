"use client";

import { useCallback, useRef, useState } from "react";

import { copyShareLink } from "@/lib/share/copyLink";
import { openFacebookShare } from "@/lib/share/facebookShare";
import { getCurrentPageShareUrl } from "@/lib/share/shareUrl";

interface UsePageShareOptions {
  onToastMessage?: (message: string) => void;
}

/**
 * 페이지 공유 (링크 복사 · Facebook)
 * 카카오 커스텀 템플릿은 MoverDetailShare + hooks/kakao/share 에서 연동합니다.
 * // 2026.07.30 정슬기 - [추가]
 */
export function usePageShare({ onToastMessage }: UsePageShareOptions = {}) {
  const [busyAction, setBusyAction] = useState<"copy" | "facebook" | null>(null);
  const busyRef = useRef(false);

  const resolveUrl = useCallback(() => {
    const url = getCurrentPageShareUrl();
    if (!url) {
      onToastMessage?.("공유할 주소를 확인할 수 없습니다.");
      return null;
    }
    return url;
  }, [onToastMessage]);

  const runExclusive = useCallback(async (action: typeof busyAction, task: () => Promise<void>) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusyAction(action);
    try {
      await task();
    } finally {
      busyRef.current = false;
      setBusyAction(null);
    }
  }, []);

  const shareCopy = useCallback(() => {
    void runExclusive("copy", async () => {
      const url = resolveUrl();
      if (!url) return;
      try {
        await copyShareLink(url);
        onToastMessage?.("링크가 복사되었습니다.");
      } catch {
        onToastMessage?.("링크 복사에 실패했습니다.");
      }
    });
  }, [onToastMessage, resolveUrl, runExclusive]);

  const shareFacebook = useCallback(() => {
    void runExclusive("facebook", async () => {
      const url = resolveUrl();
      if (!url) return;
      const opened = openFacebookShare(url);
      if (!opened) {
        onToastMessage?.("팝업이 차단되어 페이스북 공유 창을 열 수 없습니다.");
      }
    });
  }, [onToastMessage, resolveUrl, runExclusive]);

  return {
    busyAction,
    isBusy: busyAction !== null,
    shareCopy,
    shareFacebook,
  };
}
