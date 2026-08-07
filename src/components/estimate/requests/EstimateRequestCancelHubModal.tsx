"use client";

import Image from "next/image";

import Modal from "@/components/common/Modal/Modal";
import { Text } from "@/components/common/Text";
import { getDesignatedMoverDisplayName } from "@/lib/utils/estimateFormat";
import { cn } from "@/lib/utils/cn";
import { resolveMoverProfileImageSrc } from "@/lib/utils/moverProfileImage";
import type { MyEstimateRequestDesignatedMover } from "@/types/estimate";

const PANEL_CLASSNAME = cn(
  "items-stretch text-left",
  "w-full max-w-none gap-20 px-16 pt-20 pb-[max(24px,env(safe-area-inset-bottom))]",
  "max-h-[min(82dvh,680px)] overflow-hidden",
  "md:max-h-[80vh] md:max-w-[480px] md:gap-32 md:px-24 md:pt-32 md:pb-40",
);

export interface EstimateRequestCancelHubModalProps {
  open: boolean;
  designatedMovers: MyEstimateRequestDesignatedMover[];
  /** 확인 모달/요청 진행 중이면 ESC·바깥 클릭 닫기 비활성 */
  closeDisabled?: boolean;
  onClose: () => void;
  onSelectDesignateCancel: (moverId: string) => void;
  onSelectFullCancel: () => void;
}

/**
 * 견적 요청 취소 허브 — 지정 개별 취소 / 전체 취소 선택
 * 실제 취소는 각각 확인 모달에서 한 번 더 묻는다.
 * 모바일은 bottom sheet, md 이상은 중앙 modal.
 * // 2026.08.07 정슬기 - [추가]
 * // 2026.08.07 정슬기 - [수정] 모바일 높이·타이포 보완 및 responsive bottom sheet 적용
 */
export default function EstimateRequestCancelHubModal({
  open,
  designatedMovers,
  closeDisabled = false,
  onClose,
  onSelectDesignateCancel,
  onSelectFullCancel,
}: EstimateRequestCancelHubModalProps) {
  const hasDesignatedMovers = designatedMovers.length > 0;

  return (
    <Modal
      open={open}
      onClose={closeDisabled ? undefined : onClose}
      presentation="responsive"
      className={PANEL_CLASSNAME}
    >
      <div className="flex w-full shrink-0 items-center justify-between gap-12">
        <Modal.Title variant={{ base: "xl-bold", md: "2xl-semibold" }}>견적 요청 취소</Modal.Title>
        <Modal.Close onClose={onClose} disabled={closeDisabled} />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col items-stretch gap-16 md:gap-32">
        <Modal.Desc variant={{ base: "md-medium", md: "2lg-medium" }}>
          {hasDesignatedMovers
            ? "지정한 기사님만 취소하거나, 견적 요청 전체를 취소할 수 있어요."
            : "견적 요청 전체를 취소할 수 있어요. 취소하면 받은 견적도 함께 취소됩니다."}
        </Modal.Desc>

        {hasDesignatedMovers ? (
          <section
            className="flex min-h-0 w-full flex-1 flex-col gap-10 md:gap-12"
            aria-label="지정 견적 요청 대상 기사님"
          >
            <Text as="h3" variant="md-semibold" className="text-text-brand shrink-0">
              지정 견적 요청
            </Text>

            <ul className="flex min-h-0 w-full flex-1 flex-col gap-10 overflow-y-auto pr-2 md:gap-12">
              {designatedMovers.map((item) => {
                const displayName = getDesignatedMoverDisplayName(item.mover);
                const imageUrl = item.mover.moverProfile?.imageUrl;

                return (
                  <li
                    key={item.moverId}
                    className="border-border-subtle rounded-12 flex w-full shrink-0 items-center justify-between gap-8 border px-10 py-8 md:gap-12 md:px-12 md:py-10"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-8 md:gap-10">
                      <div className="bg-background-avatar rounded-12 relative size-36 shrink-0 overflow-hidden md:size-40">
                        <Image
                          src={resolveMoverProfileImageSrc(imageUrl)}
                          alt={`${displayName} 프로필`}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <Text
                        as="span"
                        variant={{ base: "md-semibold", md: "lg-semibold" }}
                        className="text-text-primary min-w-0 wrap-break-word"
                      >
                        {displayName}
                      </Text>
                    </div>

                    <Modal.Button
                      type="button"
                      variant="outline"
                      size="cta"
                      disabled={closeDisabled}
                      aria-label={`${displayName} 지정 취소`}
                      onClick={() => onSelectDesignateCancel(item.moverId)}
                      className="rounded-12 h-36 min-w-0 shrink-0 px-10 py-6 md:h-40 md:px-12 md:py-8"
                    >
                      지정 취소
                    </Modal.Button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        <div className="flex w-full shrink-0 flex-col-reverse gap-8 pt-2 md:flex-row md:gap-12 md:pt-0">
          <Modal.Button
            type="button"
            variant="outline"
            size="cta"
            fullWidth
            disabled={closeDisabled}
            onClick={onClose}
            className="md:flex-1"
          >
            돌아가기
          </Modal.Button>
          <Modal.Button
            type="button"
            variant="solid"
            size="cta"
            fullWidth
            disabled={closeDisabled}
            onClick={onSelectFullCancel}
            className="md:flex-1"
          >
            전체 취소
          </Modal.Button>
        </div>
      </div>
    </Modal>
  );
}
