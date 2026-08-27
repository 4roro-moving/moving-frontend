"use client";

import { useTranslations } from "next-intl";

import { useCallback, useRef, useState } from "react";

import { shareFacebook } from "@/lib/facebook/share";
import { copyShareLink, getCurrentPageShareUrl } from "@/lib/share/client";

interface UsePageShareOptions {
  onToastMessage?: (message: string) => void;
}

export function usePageShare({ onToastMessage }: UsePageShareOptions = {}) {
  const t = useTranslations("common");
  const [busyAction, setBusyAction] = useState<"copy" | "facebook" | null>(null);
  const busyRef = useRef(false);

  const resolveUrl = useCallback(() => {
    const url = getCurrentPageShareUrl();
    if (!url) {
      onToastMessage?.(t("share.noUrl"));
      return null;
    }
    return url;
  }, [onToastMessage, t]);

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
        onToastMessage?.(t("share.copied"));
      } catch {
        onToastMessage?.(t("share.copyFailed"));
      }
    });
  }, [onToastMessage, resolveUrl, runExclusive, t]);

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
