"use client";

import { useCallback, useRef, useState } from "react";

import { getKakaoShareErrorMessage, shareKakaoDefault } from "@/lib/kakao/share";
import { copyShareLink } from "@/lib/share/copyLink";
import { openFacebookShare } from "@/lib/share/facebookShare";
import {
  getCurrentPageShareUrl,
  getOwnerOnlyShareNotice,
  type ShareLinkAccess,
} from "@/lib/share/shareUrl";

interface UsePageShareOptions {
  /** public: 외부 열람 가능 / owner: 소유자 로그인 시에만 상세 확인 가능 */
  linkAccess?: ShareLinkAccess;
  onToastMessage?: (message: string) => void;
  kakaoTitle?: string;
  kakaoDescription?: string;
}

/**
 * 페이지 공유 (링크 복사 · 카카오 · Facebook)
 * Web Share API는 Figma에 별도 CTA가 없어 UI에 추가하지 않습니다.
 * // 2026.07.30 정슬기 - [추가]
 */
export function usePageShare({
  linkAccess = "public",
  onToastMessage,
  kakaoTitle,
  kakaoDescription,
}: UsePageShareOptions = {}) {
  const [busyAction, setBusyAction] = useState<"copy" | "kakao" | "facebook" | null>(null);
  const busyRef = useRef(false);

  const resolveUrl = useCallback(() => {
    const url = getCurrentPageShareUrl();
    if (!url) {
      onToastMessage?.("공유할 주소를 확인할 수 없습니다.");
      return null;
    }
    return url;
  }, [onToastMessage]);

  const withAccessNotice = useCallback(
    (base: string) => {
      if (linkAccess !== "owner") {
        return base;
      }
      return `${base} ${getOwnerOnlyShareNotice()}`;
    },
    [linkAccess],
  );

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
        onToastMessage?.(withAccessNotice("링크가 복사되었습니다."));
      } catch {
        onToastMessage?.("링크 복사에 실패했습니다.");
      }
    });
  }, [onToastMessage, resolveUrl, runExclusive, withAccessNotice]);

  const shareKakao = useCallback(() => {
    void runExclusive("kakao", async () => {
      const url = resolveUrl();
      if (!url) return;
      try {
        await shareKakaoDefault({
          url,
          title: kakaoTitle,
          description: kakaoDescription,
        });
        onToastMessage?.(withAccessNotice("카카오톡 공유를 실행했습니다."));
      } catch (error) {
        onToastMessage?.(getKakaoShareErrorMessage(error));
      }
    });
  }, [kakaoDescription, kakaoTitle, onToastMessage, resolveUrl, runExclusive, withAccessNotice]);

  const shareFacebook = useCallback(() => {
    void runExclusive("facebook", async () => {
      const url = resolveUrl();
      if (!url) return;
      const opened = openFacebookShare(url);
      if (!opened) {
        onToastMessage?.("팝업이 차단되어 페이스북 공유 창을 열 수 없습니다.");
        return;
      }
      onToastMessage?.(withAccessNotice("페이스북 공유 창을 열었습니다."));
    });
  }, [onToastMessage, resolveUrl, runExclusive, withAccessNotice]);

  return {
    busyAction,
    isBusy: busyAction !== null,
    shareCopy,
    shareKakao,
    shareFacebook,
  };
}
