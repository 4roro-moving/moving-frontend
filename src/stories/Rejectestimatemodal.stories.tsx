import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import RejectEstimateModal from "@/components/estimate/RejectEstimateModal";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

/**
 * NOTE: 실제 MoverEstimateRequest 타입 필드에 맞게 값을 조정해주세요.
 * EstimateRequestSummaryContent가 요구하는 필드가 더 있다면 함께 채워야 합니다.
 */
const mockRequest = {
  customer: { name: "홍길동" },
  moveType: "HOME",
  isDesignated: true,
  fromRegion: "서울 강남구",
  toRegion: "경기 성남시",
  moveDate: "2026-08-20",
} as unknown as MoverEstimateRequest;

const meta = {
  title: "Modal/Estimate/RejectEstimateModal",
  component: RejectEstimateModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "기사님이 견적 요청을 반려할 때 사유를 입력받는 모달입니다. `open`으로 등장/퇴장 모션을 제어합니다.",
      },
    },
  },
  args: {
    open: true,
    request: mockRequest,
    isPending: false,
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof RejectEstimateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "초기 상태입니다. 사유를 입력하지 않아 반려하기 버튼이 비활성화되어 있습니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);
    const submitButton = await canvas.findByRole("button", { name: "반려하기" });

    expect(submitButton).toBeDisabled();
  },
};
