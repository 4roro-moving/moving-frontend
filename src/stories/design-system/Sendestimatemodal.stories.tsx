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

export const PriceFormatting: Story = {
  parameters: {
    docs: {
      description: {
        story: "숫자만 입력되며, 입력한 값은 천 단위 콤마로 자동 포맷됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const priceInput = await canvas.findByPlaceholderText("견적가 입력");
    await userEvent.type(priceInput, "1500000");

    await waitFor(() => {
      expect(priceInput).toHaveValue("1,500,000");
    });
  },
};

export const PriceExceedsMax: Story = {
  parameters: {
    docs: {
      description: { story: "1억 원을 초과하는 견적가를 입력하면 오류 메시지가 표시됩니다." },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const priceInput = await canvas.findByPlaceholderText("견적가 입력");
    await userEvent.type(priceInput, "200000000");

    await waitFor(() => {
      expect(canvas.getByText(/1원 이상 1억 원 이하로 입력해 주세요/)).toBeInTheDocument();
    });

    const submitButton = canvas.getByRole("button", { name: "견적 보내기" });
    expect(submitButton).toBeDisabled();
  },
};

export const CommentTooShort: Story = {
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
    await userEvent.type(textarea, "짧은코멘트");
    await userEvent.tab();

    await waitFor(() => {
      expect(canvas.getByText(/10자 이상 1000자 이하로 입력해 주세요/)).toBeInTheDocument();
    });

    const submitButton = canvas.getByRole("button", { name: "견적 보내기" });
    expect(submitButton).toBeDisabled();
  },
};

export const ValidInputEnablesSubmit: Story = {
  parameters: {
    docs: {
      description: {
        story: "유효한 견적가와 코멘트를 모두 입력하면 견적 보내기 버튼이 활성화됩니다.",
      },
    },
  },
  play: async ({ args }) => {
    const canvas = within(document.body);

    const priceInput = await canvas.findByPlaceholderText("견적가 입력");
    await userEvent.type(priceInput, "850000");

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "안전하게 잘 옮겨드리겠습니다.");

    const submitButton = canvas.getByRole("button", { name: "견적 보내기" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    await userEvent.click(submitButton);
    expect(args.onSubmit).toHaveBeenCalledWith({
      price: 850000,
      comment: "안전하게 잘 옮겨드리겠습니다.",
    });
  },
};

export const CommentCounter: Story = {
  parameters: {
    docs: { description: { story: "입력한 글자 수가 실시간으로 카운터에 반영됩니다." } },
  },
  play: async () => {
    const canvas = within(document.body);

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "코멘트 테스트");

    await waitFor(() => {
      expect(canvas.getByText("7/1000")).toBeInTheDocument();
    });
  },
};

export const Pending: Story = {
  args: { isPending: true },
  parameters: {
    docs: {
      description: {
        story: "제출 중(isPending) 상태입니다. 닫기 버튼과 제출 버튼이 비활성화됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const closeButton = await canvas.findByRole("button", { name: "모달 닫기" });
    const submitButton = canvas.getByRole("button", { name: "견적 보내는 중..." });

    expect(closeButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  },
};
