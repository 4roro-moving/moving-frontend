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
          "기사님이 견적 요청을 반려할 때 사유를 입력받는 모달입니다. `open` prop이 따로 없어 부모가 조건부 렌더링으로 열고 닫습니다.",
      },
    },
  },
  args: {
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

export const ReasonTooShort: Story = {
  parameters: {
    docs: {
      description: {
        story: "10자 미만으로 입력하고 포커스를 벗어나면 검증 오류 메시지가 표시됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const textarea = await canvas.findByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "짧은사유");
    await userEvent.tab();

    await waitFor(() => {
      expect(canvas.getByText(/10자 이상 1000자 이하로 입력해 주세요/)).toBeInTheDocument();
    });

    const submitButton = canvas.getByRole("button", { name: "반려하기" });
    expect(submitButton).toBeDisabled();
  },
};

export const ValidReasonEnablesSubmit: Story = {
  parameters: {
    docs: {
      description: { story: "10자 이상의 사유를 입력하면 반려하기 버튼이 활성화됩니다." },
    },
  },
  play: async ({ args }) => {
    const canvas = within(document.body);

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "고객 요청 지역이 서비스 가능 지역을 벗어났습니다.");

    const submitButton = canvas.getByRole("button", { name: "반려하기" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await userEvent.click(submitButton);
    expect(args.onSubmit).toHaveBeenCalledWith("고객 요청 지역이 서비스 가능 지역을 벗어났습니다.");
  },
};

export const CharacterCounter: Story = {
  parameters: {
    docs: { description: { story: "입력한 글자 수가 실시간으로 카운터에 반영됩니다." } },
  },
  play: async () => {
    const canvas = within(document.body);

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "사유 테스트");

    await waitFor(() => {
      expect(canvas.getByText("6/1000")).toBeInTheDocument();
    });
  },
};

export const Pending: Story = {
  args: { isPending: true },
  parameters: {
    docs: {
      description: {
        story:
          "제출 중(isPending) 상태입니다. 닫기 버튼, textarea, 제출 버튼이 모두 비활성화됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const closeButton = await canvas.findByRole("button", { name: "모달 닫기" });
    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    const submitButton = canvas.getByRole("button", { name: "반려하는 중..." });

    expect(closeButton).toBeDisabled();
    expect(textarea).toBeDisabled();
    expect(submitButton).toBeDisabled();
  },
};
