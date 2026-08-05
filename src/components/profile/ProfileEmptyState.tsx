"use client";

import type { ReactNode } from "react";

import EmptyState from "@/components/common/EmptyState/EmptyState";

interface ProfileEmptyStateProps {
  description: ReactNode;
  /** CTA 이동 경로 (역할 홈·로그인 등) */
  href: string;
  buttonLabel?: string;
}

/** 프로필 화면 공통 EmptyState (접근 불가·조회 실패 등) */
const ProfileEmptyState = ({
  description,
  href,
  buttonLabel = "뒤로 돌아가기",
}: ProfileEmptyStateProps) => {
  return (
    <EmptyState
      imageSrc="/images/empty/character.png"
      description={description}
      buttonLabel={buttonLabel}
      href={href}
    />
  );
};

export default ProfileEmptyState;
