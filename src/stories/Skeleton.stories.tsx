import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MoverCardSkeleton } from "@/components/mover/MoverCardSkeleton";
import { Skeleton } from "@/components/common/Skeleton/Skeleton";

const meta = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "콘텐츠를 불러오는 동안 최종 레이아웃과 비슷한 형태를 보여주는 로딩 placeholder입니다. `className`으로 실제 요소의 크기와 둥글기를 맞춰 사용합니다.\n\n" +
          "여러 개를 조합해 도메인별 스켈레톤(예: `MoverCardSkeleton`)을 만들 때는, 실제 콘텐츠와 같은 레이아웃 컨테이너 안에 `Skeleton`을 배치하는 방식을 씁니다.",
      },
    },
  },
  argTypes: {
    className: { control: "text", description: "placeholder의 크기와 모양을 지정하는 클래스" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { className: "h-24 w-160" },
  parameters: {
    docs: {
      source: { code: `<Skeleton className="h-24 w-160" />`, language: "tsx" },
    },
  },
};

export const RealWorldExample: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`MoverCardSkeleton`처럼 실제 카드 레이아웃과 동일한 구조 위에 `Skeleton`을 배치한 예시입니다.",
      },
    },
  },
  render: () => <MoverCardSkeleton variant="compact" />,
};
