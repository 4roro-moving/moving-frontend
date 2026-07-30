"use client";

import { useState } from "react";

import Input from "@/components/common/Input/Input";
import Modal from "@/components/common/Modal";
import { Text } from "@/components/common/Text";
import Textarea from "@/components/common/Input/Textarea";
import EstimateRequestSummaryContent from "@/components/estimate/EstimateRequestSummaryContent";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

const MAX_PRICE = 100_000_000;
const MIN_COMMENT_LENGTH = 10;
const MAX_COMMENT_LENGTH = 1000;

export interface SendEstimateInput {
  price: number;
  comment: string;
}

interface SendEstimateModalProps {
  request: MoverEstimateRequest;
  onClose: () => void;
  onSubmit: (input: SendEstimateInput) => void;
  isPending?: boolean;
}

export default function SendEstimateModal({
  request,
  onClose,
  onSubmit,
  isPending = false,
}: SendEstimateModalProps) {
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");

  //가격 및 코멘트 변환
  const numericPrice = Number(price);
  const trimmedComment = comment.trim();

  //가격 및 코멘트 검증
  const isPriceValid = numericPrice > 0 && numericPrice <= MAX_PRICE;
  const isCommentValid =
    trimmedComment.length >= MIN_COMMENT_LENGTH && trimmedComment.length <= MAX_COMMENT_LENGTH;

  //제안할 수 있는지 확인
  const canSubmit = isPriceValid && isCommentValid && !isPending;

  //가격 검증 오류 메시지
  const priceError =
    price.length > 0 && !isPriceValid
      ? "견적가는 1원 이상 1억 원 이하로 입력해 주세요."
      : undefined;
  //코멘트 검증 오류 메시지
  const commentError =
    comment.length > 0 && !isCommentValid
      ? `코멘트는 ${MIN_COMMENT_LENGTH}자 이상 ${MAX_COMMENT_LENGTH}자 이하로 입력해 주세요.`
      : undefined;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      price: numericPrice,
      comment: trimmedComment,
    });
  };

  return (
    <Modal
      open
      title="견적 보내기"
      confirmLabel={isPending ? "견적 보내는 중..." : "견적 보내기"}
      confirmDisabled={!canSubmit}
      onConfirm={handleSubmit}
      onClose={onClose}
      overlayClassName="items-end px-0 min-[744px]:items-center min-[744px]:px-24"
      className="min-[744px]:rounded-32 max-h-[calc(100dvh-104px)] max-w-none rounded-b-none min-[744px]:w-[375px] lg:w-full lg:max-w-[608px]"
    >
      <div className="flex min-h-0 flex-col gap-32 overflow-y-auto">
        <section>
          {/* 2026.07.29 정슬기 - [수정] 요청 요약 공통 컴포넌트 재사용 */}
          <EstimateRequestSummaryContent
            density="modal"
            moveType={request.moveType}
            isDesignated={request.isDesignated}
            title={`${request.customer.name} 고객님`}
            fromLabel={request.fromRegion}
            toLabel={request.toRegion}
            moveDate={request.moveDate}
          />
        </section>

        <div className="flex flex-col gap-16">
          <Text as="label" htmlFor="estimate-price" variant="2lg-semibold">
            견적가를 입력해 주세요
          </Text>
          <Input
            id="estimate-price"
            inputMode="numeric"
            size="md"
            numericOnly
            value={price ? Number(price).toLocaleString("ko-KR") : ""}
            placeholder="견적가 입력"
            error={priceError}
            onChange={(event) => setPrice(event.target.value)}
            className="h-54 text-lg"
          />
        </div>

        <div className="flex flex-col gap-16">
          <Text as="label" htmlFor="estimate-comment" variant="2lg-semibold">
            코멘트를 입력해 주세요
          </Text>
          <Textarea
            id="estimate-comment"
            value={comment}
            maxLength={MAX_COMMENT_LENGTH}
            placeholder="최소 10자 이상 입력해주세요"
            error={commentError}
            onChange={(event) => setComment(event.target.value)}
            className="h-[160px] resize-none px-24 py-14 text-lg"
          />
        </div>
      </div>
    </Modal>
  );
}
