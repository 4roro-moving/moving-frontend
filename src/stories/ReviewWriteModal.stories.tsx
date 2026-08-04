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
