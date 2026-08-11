import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import SelectableChip from "@/components/common/Chip/SelectableChip";

const CHIP_SOURCE = `const [isSelected, setIsSelected] = useState(false);

<SelectableChip selected={isSelected} onClick={() => setIsSelected((prev) => !prev)}>
  소형이사
</SelectableChip>`;

const meta = {
  title: "Domain/SelectableChip",
  component: SelectableChip,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "이사 유형·지역처럼 하나 이상 선택할 수 있는 텍스트 칩입니다. 클릭 핸들러를 전달하면 button으로 렌더링됩니다.",
      },
    },
  },
  args: { children: "소형이사", selected: false, onClick: fn() },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "responsive"],
      description: "Chip의 패딩과 텍스트 크기 규격",
    },
    selected: { control: "boolean", description: "선택 여부에 따른 스타일 적용" },
    onClick: {
      control: false,
      description: "Chip 클릭 시 호출되는 핸들러. 전달하면 선택 가능한 Chip으로 동작",
    },
    disabled: { control: "boolean", description: "선택 불가 상태" },
    children: { control: "text", description: "Chip에 표시할 텍스트 또는 콘텐츠" },
    className: { control: "text", description: "레이아웃이나 스타일을 확장하는 클래스" },
  },
} satisfies Meta<typeof SelectableChip>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledSelectableChip(args: React.ComponentProps<typeof SelectableChip>) {
  const [selected, setSelected] = useState(args.selected ?? false);

  return (
    <SelectableChip
      {...args}
      selected={selected}
      onClick={() => {
        setSelected((prev) => !prev);
        args.onClick?.();
      }}
    />
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "Chip을 눌러 선택 상태를 전환합니다." },
      source: { code: CHIP_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ControlledSelectableChip {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap gap-12">
      <SelectableChip>서울</SelectableChip>
      <SelectableChip selected>소형이사</SelectableChip>
      <SelectableChip disabled onClick={() => {}}>
        선택 불가
      </SelectableChip>
    </div>
  ),
};
