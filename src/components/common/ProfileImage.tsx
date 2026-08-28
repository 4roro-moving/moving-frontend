"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { DEFAULT_PROFILE_IMAGE, getAllowedImageSrc } from "@/lib/utils/safeImageSrc";

interface ProfileImageProps extends Omit<ImageProps, "src" | "alt" | "onError"> {
  src: string | null | undefined;
  alt?: string;
}

type ProfileImageInnerProps = Omit<ProfileImageProps, "src"> & { src: string };

function ProfileImageInner({ src, alt = "", ...imageProps }: ProfileImageInnerProps) {
  const [hasError, setHasError] = useState(false);
  const currentSrc = hasError ? DEFAULT_PROFILE_IMAGE : src;

  return (
    <Image
      {...imageProps}
      src={currentSrc}
      alt={alt}
      onError={() => {
        if (currentSrc !== DEFAULT_PROFILE_IMAGE) {
          setHasError(true);
        }
      }}
    />
  );
}

/** 프로필 URL 검사와 이미지 로드 실패 시 기본 곰돌이 폴백을 공통 처리합니다. */
export function ProfileImage({ src, ...props }: ProfileImageProps) {
  const resolvedSrc = getAllowedImageSrc(src) ?? DEFAULT_PROFILE_IMAGE;

  return <ProfileImageInner key={resolvedSrc} src={resolvedSrc} {...props} />;
}
