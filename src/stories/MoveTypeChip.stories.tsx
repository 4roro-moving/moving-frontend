import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MoveTypeChip } from "@/components/common/Chip/MoveTypeChip";
import DesignatedChip from "@/components/estimate/DesignatedChip";

const meta = {
  title: "Domain/MoveTypeChip",
  component: MoveTypeChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "이사 유형을 아이콘과 함께 표시하는 읽기 전용 칩입니다. `moveType`에 따라 아이콘과 문구가 함께 바뀝니다.",
      },
    },
  },
  args: { moveType: "SMALL", size: "md" },
  argTypes: {
    moveType: {
      control: "inline-radio",
      options: ["SMALL", "HOME", "OFFICE"],
      description: "표시할 이사 유형",
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Chip의 패딩과 텍스트 크기 규격",
    },
    className: { control: "text", description: "레이아웃이나 스타일을 확장하는 클래스" },
  },
} satisfies Meta<typeof MoveTypeChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllMoveTypes: Story = {
  parameters: {
    docs: {
      description: { story: "소형·가정·사무실 이사 유형을 함께 비교합니다." },
      source: {
        code: `<div className="flex flex-wrap gap-8">
  <MoveTypeChip moveType="SMALL" />
  <MoveTypeChip moveType="HOME" />
  <MoveTypeChip moveType="OFFICE" />
</div>`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8">
      <MoveTypeChip moveType="SMALL" />
      <MoveTypeChip moveType="HOME" />
      <MoveTypeChip moveType="OFFICE" />
    </div>
  ),
};

export const Sizes: Story = {
  parameters: {
    docs: {
      description: { story: "목록 카드에는 `sm`, 상세 정보에는 `md`를 사용합니다." },
      source: {
        code: `<div className="flex flex-wrap items-center gap-8">
  <MoveTypeChip moveType="HOME" size="sm" />
  <MoveTypeChip moveType="HOME" size="md" />
</div>`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      <MoveTypeChip moveType="HOME" size="sm" />
      <MoveTypeChip moveType="HOME" size="md" />
    </div>
  ),
};

export const WithDesignated: Story = {
  parameters: {
    docs: {
      description: {
        story: "견적 화면에서 함께 쓰이는 지정 견적 요청 칩까지 포함해 색상과 크기를 비교합니다.",
      },
      source: {
        code: `import DesignatedChip from "@/components/estimate/DesignatedChip";

<div className="flex flex-wrap gap-8">
  <MoveTypeChip moveType="SMALL" />
  <MoveTypeChip moveType="HOME" />
  <MoveTypeChip moveType="OFFICE" />
  <DesignatedChip />
</div>`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex flex-wrap gap-8">
      <MoveTypeChip moveType="SMALL" />
      <MoveTypeChip moveType="HOME" />
      <MoveTypeChip moveType="OFFICE" />
      <DesignatedChip />
    </div>
  ),
};
