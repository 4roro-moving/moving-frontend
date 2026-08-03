"use client";

import Button from "@/components/common/Button/Button";
import { Text } from "@/components/common/Text";
import { LikeOutlineButton } from "@/components/mover/detail/LikeOutlineButton";

interface MoverDetailActionsProps {
  moverName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRequestEstimate: () => void;
  /** Desktop 사이드바용 / Mobile·Tablet 하단 sticky용 */
  layout: "sidebar" | "sticky";
  requestDisabled?: boolean;
  requestButtonLabel?: string;
}

export default function MoverDetailActions({
  moverName,
  isFavorite,
  onToggleFavorite,
  onRequestEstimate,
  layout,
  requestDisabled = false,
  requestButtonLabel = "지정 견적 요청하기",
}: MoverDetailActionsProps) {
  if (layout === "sticky") {
    return (
      <div className="border-border-subtle bg-background-default px-margin-mobile md:px-margin-tablet fixed inset-x-0 bottom-0 z-20 border-t py-28 xl:hidden">
        <div className="mx-auto flex w-full max-w-[600px] items-center gap-8">
          <LikeOutlineButton
            size="sm"
            moverName={moverName}
            isFavorite={isFavorite}
            onClick={onToggleFavorite}
            className="shrink-0"
          />
          <Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            className="min-w-0 flex-1"
            disabled={requestDisabled}
            onClick={onRequestEstimate}
          >
            {requestButtonLabel}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="hidden w-full flex-col gap-16 xl:flex" aria-label="견적 요청">
      <Text as="p" variant="2lg-semibold" className="text-text-secondary">
        {moverName} 기사님에게
        <br /> 지정 견적을 요청해보세요!
      </Text>

      <Button
        type="button"
        variant="solid"
        size="detail"
        fullWidth
        disabled={requestDisabled}
        onClick={onRequestEstimate}
      >
        {requestButtonLabel}
      </Button>

      <LikeOutlineButton
        size="lg"
        moverName={moverName}
        isFavorite={isFavorite}
        onClick={onToggleFavorite}
      />
    </section>
  );
}
