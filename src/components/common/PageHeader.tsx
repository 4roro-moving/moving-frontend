"use client";

import type { ReactNode } from "react";

import DetailBackButton from "@/components/common/DetailBackButton";
import { Text } from "@/components/common/Text";

interface PageHeaderProps {
  title: string;
  /** 있으면 제목 위에 뒤로가기 버튼을 표시합니다. */
  backFallbackHref?: string;
  /** 제목 오른쪽에 표시할 액션 영역입니다. */
  actions?: ReactNode;
}

export function PageHeader({ title, backFallbackHref, actions }: PageHeaderProps) {
  const hasAdditionalContent = Boolean(backFallbackHref || actions);

  return (
    <header className="bg-background-default shadow-page-header flex w-full max-w-full items-center justify-center overflow-x-hidden">
      <div
        className={
          hasAdditionalContent
            ? "px-margin-mobile md:px-margin-tablet max-w-container-desktop mx-auto flex w-full min-w-0 flex-1 flex-col items-start gap-8 py-12 md:py-14 xl:px-0 xl:py-16"
            : "px-margin-mobile md:px-margin-tablet h-page-header-height-mobile md:h-page-header-height-tablet xl:h-page-header-height-desktop max-w-container-desktop mx-auto flex w-full min-w-0 flex-1 items-center xl:px-0"
        }
      >
        {backFallbackHref ? <DetailBackButton fallbackHref={backFallbackHref} /> : null}

        <div className="flex w-full min-w-0 items-center justify-between gap-12">
          <Text as="h1" variant="pageTitle" className="text-text-primary min-w-0">
            {title}
          </Text>

          {actions ? <div className="flex shrink-0 items-center">{actions}</div> : null}
        </div>
      </div>
    </header>
  );
}
