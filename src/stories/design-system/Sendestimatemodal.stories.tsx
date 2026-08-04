import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import SendEstimateModal from "@/components/estimate/SendEstimateModal";
import type { MoverEstimateRequest } from "@/types/moverEstimateRequest";

/**
 * NOTE: 실제 MoverEstimateRequest 타입 필드에 맞게 값을 조정해주세요.
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
  title: "Modal/Estimate/SendEstimateModal",
  component: SendEstimateModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "기사님이 견적가와 코멘트를 입력해 견적을 보내는 모달입니다. `open` prop이 따로 없어 부모가 조건부 렌더링으로 열고 닫습니다.",
      },
    },
  },
  args: {
    request: mockRequest,
    isPending: false,
    onClose: fn(),
    onSubmit: fn(),
  },
} satisfies Meta<typeof SendEstimateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "초기 상태입니다. 견적가·코멘트를 입력하지 않아 견적 보내기 버튼이 비활성화되어 있습니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);
    const submitButton = await canvas.findByRole("button", { name: "견적 보내기" });

    expect(submitButton).toBeDisabled();
  },
};
