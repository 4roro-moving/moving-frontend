"use client";

import { useCallback, useRef, useState } from "react";

import { shareFacebook } from "@/hooks/facebook/share";
import { copyShareLink } from "@/lib/share/copyLink";
import { getCurrentPageShareUrl } from "@/lib/share/shareUrl";

interface UsePageShareOptions {
  onToastMessage?: (message: string) => void;
}

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

  const shareFacebookHandler = useCallback(() => {
    void runExclusive("facebook", async () => {
      const url = resolveUrl();
      if (!url) return;

      await shareFacebook({
        href: url,
        onError: (message: string) => onToastMessage?.(message),
      });
    });
  }, [onToastMessage, resolveUrl, runExclusive]);

  return {
    busyAction,
    isBusy: busyAction !== null,
    shareCopy,
    shareFacebook: shareFacebookHandler,
  };
}
