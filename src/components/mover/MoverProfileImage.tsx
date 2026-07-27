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
}

function MoverProfileImageInner({
  src,
  width,
  height,
  className,
  priority = false,
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
 * picsum 등은 요청 전에 기본 이미지로 바꾸고, 그 외 원격 실패 시 onError로 폴백합니다.
 */
export function MoverProfileImage({ src, ...props }: MoverProfileImageProps) {
  const resolvedSrc = resolveMoverProfileImageSrc(src);

  return <MoverProfileImageInner key={resolvedSrc} src={resolvedSrc} {...props} />;
}
