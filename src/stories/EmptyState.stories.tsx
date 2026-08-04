import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import EmptyState from "@/components/common/EmptyState/EmptyState";

const EMPTY_STATE_SOURCE = `
<EmptyState
  imageSrc="/images/empty-moving-car.png"
  description="아직 받은 요청이 없어요"
  buttonLabel="견적 요청하기"
  href="/estimate/request"
/>`;

const meta = {
  title: "Feedback/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "목록이나 검색 결과가 비어 있을 때 안내 문구와 선택적 이동 버튼을 보여줍니다. 화면에 맞춰 `size`를 지정하거나 기본 반응형 크기를 사용할 수 있습니다.",
      },
    },
  },
  args: {
    imageSrc: "/images/empty-moving-car.png",
    description: "아직 받은 요청이 없어요",
    buttonLabel: "견적 요청하기",
    href: "/estimate/request",
  },
  argTypes: {
    imageSrc: { control: "text", description: "비어 있는 상태에 표시할 이미지 경로" },
    imageAlt: { control: "text", description: "이미지 대체 텍스트" },
    description: { control: "text", description: "이미지 아래에 표시할 안내 문구" },
    buttonLabel: { control: "text", description: "선택적으로 표시할 이동 버튼 문구" },
    href: { control: "text", description: "이동 버튼의 링크 경로" },
    size: {
      control: "inline-radio",
      options: ["sm", "lg"],
      description: "고정 크기 규격. 비우면 화면 크기에 맞춰 반응형으로 표시",
    },
    className: { control: "text", description: "EmptyState 영역의 레이아웃을 확장하는 클래스" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: { source: { code: EMPTY_STATE_SOURCE, language: "tsx" } },
  },
};

export const WithoutAction: Story = {
  args: {
    description: "아직 작성한 후기가 없어요",
    buttonLabel: undefined,
    href: undefined,
    size: "sm",
  },
  parameters: {
    docs: {
      description: { story: "다음 행동을 안내할 필요가 없을 때는 버튼 없이 사용합니다." },
      source: {
        code: `<EmptyState
  imageSrc="/images/empty-moving-car.png"
  description="아직 작성한 후기가 없어요"
  size="sm"
/>`,
        language: "tsx",
      },
    },
  },
};
