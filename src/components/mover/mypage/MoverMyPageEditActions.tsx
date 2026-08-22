"use client";

import Button from "@/components/common/Button/Button";
import { WriteIcon } from "@/icons";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

interface MoverMyPageEditActionsProps {
  desktop?: boolean;
}

export default function MoverMyPageEditActions({ desktop = false }: MoverMyPageEditActionsProps) {
  return (
    <div className={cn("grid w-full gap-12 md:grid-cols-2 md:gap-16", desktop && "xl:grid-cols-1")}>
      <Button
        href={APP_ROUTES.MOVER_PROFILE_EDIT}
        variant="solid"
        size="auth"
        fullWidth
        rightIcon={<WriteIcon className="size-24 shrink-0" aria-hidden="true" />}
        className={cn("gap-4 md:h-64 md:gap-8", desktop ? "xl:order-1" : "order-1 md:order-2")}
      >
        내 프로필 수정
      </Button>

      <Button
        href={APP_ROUTES.MOVER_BASIC_EDIT}
        variant="outline"
        size="auth"
        fullWidth
        rightIcon={<WriteIcon className="size-24 shrink-0" aria-hidden="true" />}
        className={cn(
          "border-border-disabled text-text-weak hover:bg-background-surface gap-4 md:h-64 md:gap-8",
          desktop ? "xl:order-2" : "order-2 md:order-1",
        )}
      >
        기본 정보 수정
      </Button>
    </div>
  );
}
