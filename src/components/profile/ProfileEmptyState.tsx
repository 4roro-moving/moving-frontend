"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/common/EmptyState/EmptyState";

interface ProfileEmptyStateProps {
  description: ReactNode;
  /** CTA 이동 경로 (역할 홈·로그인 등) */
  href: string;
  buttonLabel?: string;
}

/** 프로필 화면 공통 EmptyState (접근 불가·조회 실패 등) */
const ProfileEmptyState = ({ description, href, buttonLabel }: ProfileEmptyStateProps) => {
  const t = useTranslations("profile");
  return (
    <EmptyState
      imageSrc="/images/empty/character.png"
      description={description}
      buttonLabel={buttonLabel ?? t("back")}
      href={href}
    />
  );
};

export default ProfileEmptyState;
