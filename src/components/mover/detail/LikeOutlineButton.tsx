"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { useTranslations } from "next-intl";
import { forwardRef, type ButtonHTMLAttributes } from "react";

import { Text } from "@/components/common/Text";
import { LikeIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

/**
 * Figma: button/like/outlined
 * - sm: 54×54 아이콘만
 * - lg: 64px 높이, 아이콘 + 라벨 (찜하기 / 찜 해제)
 */
const likeOutlineButtonVariants = cva(
  [
    "inline-flex items-center justify-center border border-border-default bg-background-surface",
    "rounded-16 text-text-primary transition-colors",
    "hover:bg-background-subtle focus-visible:ring-border-brand focus-visible:ring-2 focus-visible:outline-none",
  ],
  {
    variants: {
      size: {
        sm: "size-54 gap-10 p-10",
        lg: "h-64 w-full gap-4 px-16",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  },
);

export interface LikeOutlineButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof likeOutlineButtonVariants> {
  isFavorite?: boolean;
  moverName?: string;
}

export const LikeOutlineButton = forwardRef<HTMLButtonElement, LikeOutlineButtonProps>(
  function LikeOutlineButton(
    { size = "sm", isFavorite = false, moverName, className, type = "button", ...props },
    ref,
  ) {
    const t = useTranslations("profile");
    const resolvedSize = size ?? "sm";
    const label = t(isFavorite ? "moverDetailUnfavorite" : "moverDetailFavorite");
    const accessibleLabel = t(
      resolvedSize === "sm" ? "moverDetailFavoriteAria" : "moverDetailFavoriteActionAria",
      { name: moverName ?? "", action: label },
    );

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={isFavorite}
        aria-label={accessibleLabel}
        className={cn(likeOutlineButtonVariants({ size: resolvedSize }), className)}
        {...props}
      >
        <LikeIcon
          isFavorite={isFavorite}
          className={cn(
            "size-24 shrink-0",
            isFavorite ? "text-like-active-fill" : "text-icon-default",
          )}
        />
        {resolvedSize === "lg" ? (
          <Text as="span" variant="2lg-semibold" className="text-text-primary">
            {label}
          </Text>
        ) : null}
      </button>
    );
  },
);
