"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";
import { shareKakaoMoverCustom, toKakaoShareImageUrl, toKakaoSharePath } from "@/lib/kakao/share";
import { usePageShare } from "@/hooks/usePageShare";
import { ClipIcon } from "@/icons";
import { hasFacebookAppId } from "@/lib/facebook/share";
import { cn } from "@/lib/utils/cn";

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 4C8.477 4 4 7.582 4 12.001c0 2.85 1.86 5.35 4.66 6.79-.15.55-.54 1.99-.62 2.3-.09.36.13.35.28.26.12-.08 1.97-1.34 2.77-1.88.94.14 1.92.21 2.91.21 5.523 0 10-3.582 10-8.001C24 7.582 19.523 4 14 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M16.5 25V15.5h3.2l.5-3.7H16.5V9.4c0-1.07.3-1.8 1.84-1.8H20.3V4.3C19.8 4.2 18.5 4 16.9 4c-3.3 0-5.55 2.01-5.55 5.7v3.1H8.2v3.7h3.15V25h5.15Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface MoverDetailShareProps {
  favoriteCount: number;
  moverName: string;
  onToastMessage?: (message: string) => void;
  profileImageSrc: string;
}

const FACEBOOK_SHARE_UI_ENABLED = hasFacebookAppId();

export default function MoverDetailShare({
  favoriteCount,
  moverName,
  onToastMessage,
  profileImageSrc,
}: MoverDetailShareProps) {
  const t = useTranslations("profile");
  const { busyAction, isBusy, shareCopy, shareFacebook } = usePageShare({ onToastMessage });
  const [isKakaoSharing, setIsKakaoSharing] = useState(false);
  const kakaoSharingRef = useRef(false);
  const isShareBusy = isBusy || isKakaoSharing;
  const kakaoShare = {
    driver_name: moverName,
    like_count: String(favoriteCount),
    driver_profile: toKakaoShareImageUrl(profileImageSrc),
  };

  const iconButtonClassName = cn(
    "rounded-8 md:rounded-16 flex size-40 min-h-44 min-w-44 shrink-0 items-center justify-center transition-colors md:size-64 md:min-h-64 md:min-w-64",
    "focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
  );

  const handleKakaoShare = async (): Promise<void> => {
    if (isShareBusy || kakaoSharingRef.current) return;

    kakaoSharingRef.current = true;
    setIsKakaoSharing(true);
    try {
      const PATH = toKakaoSharePath();
      await shareKakaoMoverCustom({
        templateArgs: {
          ...kakaoShare,
          PATH,
        },
        onMissingConfig: () => onToastMessage?.(t("shareKakaoConfigNeeded")),
        onError: (message) => onToastMessage?.(message),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t("shareKakaoFailed");
      onToastMessage?.(message);
    } finally {
      kakaoSharingRef.current = false;
      setIsKakaoSharing(false);
    }
  };

  return (
    <section
      className="flex w-full flex-col gap-12 md:gap-22"
      aria-label={t("moverDetailShareTitle")}
      aria-busy={isShareBusy}
    >
      <Text
        as="h2"
        variant={{ base: "lg-semibold", xl: "xl-semibold" }}
        className="text-text-secondary"
      >
        {t("moverDetailShareTitle")}
      </Text>

      <div className="flex items-start gap-10 md:gap-16">
        <button
          type="button"
          aria-label={t("copyLink")}
          aria-busy={busyAction === "copy"}
          disabled={isShareBusy}
          onClick={shareCopy}
          className={cn(
            iconButtonClassName,
            "bg-background-surface border-border-default text-icon-default border p-10",
            "hover:bg-background-subtle active:bg-background-hover",
          )}
        >
          <ClipIcon className="text-icon-default size-24 md:size-28" aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label={t("shareKakao")}
          aria-busy={isKakaoSharing}
          disabled={isShareBusy}
          onClick={() => void handleKakaoShare()}
          className={cn(
            iconButtonClassName,
            "bg-social-kakao-background text-social-kakao-icon p-8 md:p-14",
            "hover:opacity-90 active:opacity-80",
          )}
        >
          <KakaoIcon className="size-24 md:size-28" />
        </button>

        <button
          type="button"
          aria-label={
            FACEBOOK_SHARE_UI_ENABLED ? t("shareFacebook") : t("shareFacebookUnavailable")
          }
          aria-busy={busyAction === "facebook"}
          disabled={!FACEBOOK_SHARE_UI_ENABLED || isShareBusy}
          title={FACEBOOK_SHARE_UI_ENABLED ? undefined : t("comingSoon")}
          onClick={shareFacebook}
          className={cn(
            iconButtonClassName,
            "bg-social-facebook-background text-social-facebook-icon p-8 md:p-14",
            FACEBOOK_SHARE_UI_ENABLED
              ? "hover:opacity-90 active:opacity-80"
              : "cursor-not-allowed opacity-60",
          )}
        >
          <FacebookIcon className="size-24 md:size-28" />
        </button>
      </div>
    </section>
  );
}
