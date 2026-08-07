"use client";

import Image from "next/image";
import { useState } from "react";

import {
  DEFAULT_MOVER_PROFILE_IMAGE,
  resolveMoverProfileImageSrc,
} from "@/lib/utils/moverProfileImage";
import { cn } from "@/lib/utils/cn";

export { DEFAULT_MOVER_PROFILE_IMAGE };

interface MoverProfileImageProps {
  src: string;
  width: number;
  height: number;
  className?: string;
  /** 목록 상단 카드 등 LCP에 가까운 이미지에만 지정 */
  priority?: boolean;
  /** LCP 이미지의 preload 요청 우선순위 */
  fetchPriority?: "high" | "low" | "auto";
}

function MoverProfileImageInner({
  src,
  width,
  height,
  className,
  priority = false,
  fetchPriority,
}: MoverProfileImageProps) {
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? DEFAULT_MOVER_PROFILE_IMAGE : src;

  return (
    <Image
      src={currentSrc}
      alt=""
      width={width}
      height={height}
      priority={priority}
      fetchPriority={fetchPriority}
      className={cn(className)}
      onError={() => {
        if (currentSrc !== DEFAULT_MOVER_PROFILE_IMAGE) {
          setHasError(true);
        }
      }}
    />
  );
}

/**
 * 프로필 이미지.
 * allowlist(로컬·seed picsum·CDN env)만 통과시키고, 그 외·로드 실패 시 기본 이미지로 폴백합니다.
 */
export function MoverProfileImage({ src, ...props }: MoverProfileImageProps) {
  const resolvedSrc = resolveMoverProfileImageSrc(src);

  return <MoverProfileImageInner key={resolvedSrc} src={resolvedSrc} {...props} />;
}
