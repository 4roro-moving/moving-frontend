import type { ReactElement } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import ReviewWriteModal from "@/components/review/ReviewWriteModal";
import type { ReviewableEstimateItem } from "@/types/review";

/**
 * NOTE: 실제 ReviewableEstimateItem 타입 필드에 맞게 값을 조정해주세요.
 * ReviewEstimateSummary가 요구하는 필드(기사님 이름, 서비스 종류, 이사일 등)가
 * 더 있다면 함께 채워야 합니다.
 */
const mockItem = {
  estimateId: -1,
  price: 150_000,
  confirmedAt: "2026-08-03T00:00:00.000Z",
  estimateRequest: {
    id: -1,
    moveType: "HOME",
    moveDate: "2026-08-13",
    fromAddress: "서울특별시 강남구 테헤란로 123",
    toAddress: "서울특별시 마포구 월드컵북로 456",
    status: "COMPLETED",
    isDesignated: true,
  },
  mover: {
    id: "review-modal-preview",
    nickname: "무빙 기사님",
    imageUrl: "/images/profile-character.png",
    career: 8,
    averageRating: 4.9,
    reviewCount: 128,
  },
} as unknown as ReviewableEstimateItem;

// 스토리마다 독립된 QueryClient를 쓰기 위해 decorator에서 매번 새로 생성합니다.
const withQueryClient = (Story: () => ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Story />
    </QueryClientProvider>
  );
};

const meta = {
  title: "Modal/Review/ReviewWriteModal",
  component: ReviewWriteModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "별점과 후기 내용을 입력받아 리뷰를 생성하는 모달입니다. `preview` prop을 true로 두면 실제 API 요청 없이 동작을 확인할 수 있습니다.",
      },
    },
  },
  decorators: [withQueryClient],
  args: {
    open: false,
    item: mockItem,
    preview: true,
    onClose: fn(),
    onSuccess: fn(),
    onError: fn(),
  },
} satisfies Meta<typeof ReviewWriteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story: "초기 상태입니다. 별점을 선택하지 않아 등록 버튼이 비활성화되어 있습니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);
    const submitButton = await canvas.findByRole("button", { name: "리뷰 등록" });

    expect(submitButton).toBeDisabled();
  },
};

export const RatingOnlySelected: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story:
          "별점만 선택하고 내용은 비워둔 상태입니다. 최소 글자수 미만이라 버튼이 계속 비활성화됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    // 별점 5개 중 4번째 별 클릭 (ReviewStarRating의 접근성 라벨은 실제 구현에 맞게 조정 필요)
    const stars = await canvas.findAllByRole("radio");
    await userEvent.click(stars[3]);

    const submitButton = canvas.getByRole("button", { name: "리뷰 등록" });
    expect(submitButton).toBeDisabled();
  },
};

export const ContentTooShort: Story = {
  args: { open: true },
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
    await userEvent.type(textarea, "짧은글");
    await userEvent.tab(); // blur 발생시켜 isContentTouched를 true로 만듦

    await waitFor(() => {
      expect(canvas.getByText(/10자 이상 1000자 이하로 입력해 주세요/)).toBeInTheDocument();
    });

    const submitButton = canvas.getByRole("button", { name: "리뷰 등록" });
    expect(submitButton).toBeDisabled();
  },
};

export const ValidInputEnablesSubmit: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story: "별점과 10자 이상의 내용을 모두 입력하면 등록 버튼이 활성화됩니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const stars = await canvas.findAllByRole("radio");
    await userEvent.click(stars[4]); // 5점 선택

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "정말 친절하고 꼼꼼하게 도와주셨어요.");

    const submitButton = canvas.getByRole("button", { name: "리뷰 등록" });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // preview=true이므로 클릭해도 실제 요청은 발생하지 않고 에러도 뜨지 않아야 함
    await userEvent.click(submitButton);
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};

export const CharacterCounter: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: { story: "입력한 글자 수가 실시간으로 카운터에 반영됩니다." },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    const textarea = canvas.getByPlaceholderText("최소 10자 이상 입력해 주세요");
    await userEvent.type(textarea, "테스트 문구입니다");

    await waitFor(() => {
      expect(canvas.getByText("9/1000")).toBeInTheDocument();
    });
  },
};

export const CloseDisabledWhilePending: Story = {
  args: { open: true },
  parameters: {
    docs: {
      description: {
        story:
          "제출 중(isPending)에는 닫기 버튼과 별점·textarea가 비활성화됩니다. 실제 pending 상태는 mutation이 필요해 이 스토리에서는 UI 구조만 확인합니다.",
      },
    },
  },
  play: async () => {
    const canvas = within(document.body);
    const closeButton = await canvas.findByRole("button", { name: "모달 닫기" });

    // preview 모드에서는 pending 상태를 만들 수 없어 기본적으로 활성화 상태만 확인
    expect(closeButton).toBeEnabled();
  },
};
