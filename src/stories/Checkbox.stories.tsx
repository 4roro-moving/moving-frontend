import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import Checkbox from "@/components/common/Checkbox/Checkbox";
import { Text } from "@/components/common/Text";

const CHECKBOX_DESCRIPTION = `사용자의 선택 여부를 나타내는 컴포넌트입니다. 실제 native checkbox는 시각적으로 숨깁니다.

\`checked\`와 \`onCheckedChange\`를 함께 전달해 사용합니다. 텍스트 라벨이 있으면 \`label\`에 전달하고, 라벨이 화면에 보이지 않는 경우에는 반드시 \`aria-label\`을 제공합니다.
`;

const DEFAULT_SOURCE = `const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="서비스 가능 지역"
/>`;

const CUSTOM_LABEL_SOURCE = `<Checkbox
  checked={isAllSelected}
  disabled={totalCount === 0}
  onCheckedChange={onSelectAll}
  label={
    <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }}>
      {\`전체선택(\${selectedCount}/\${totalCount})\`}
    </Text>
  }
  labelClassName="text-text-tertiary"
/>`;

const LABELLESS_SOURCE = `<Checkbox
  checked={isSelected}
  onCheckedChange={setIsSelected}
  aria-label="김무빙 기사님 선택"
/>`;

const STATES_SOURCE = `<div className="flex flex-col gap-12">
  <Checkbox checked={false} onCheckedChange={() => {}} label="선택 안 됨" />
  <Checkbox checked onCheckedChange={() => {}} label="선택됨" />
  <Checkbox disabled checked={false} onCheckedChange={() => {}} label="비활성화" />
  <Checkbox disabled checked onCheckedChange={() => {}} label="선택 후 비활성화" />
</div>`;

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: CHECKBOX_DESCRIPTION } },
  },
  args: {
    checked: false,
    label: "서비스 가능 지역",
    onCheckedChange: fn(),
  },
  argTypes: {
    checked: {
      control: false,
      description: "현재 선택 여부",
      table: { type: { summary: "boolean" } },
    },
    onCheckedChange: {
      control: false,
      description: "선택 상태가 변경될 때 다음 checked 값을 전달하는 핸들러",
      table: { type: { summary: "(checked: boolean) => void" } },
    },
    label: {
      control: "text",
      description: "체크박스 옆 라벨 (클릭 영역 포함)",
      table: { type: { summary: "ReactNode" } },
    },
    labelClassName: {
      control: "text",
      description: "라벨 영역에 적용하는 클래스",
      table: { type: { summary: "string" } },
    },
    disabled: {
      control: "boolean",
      description: "체크박스·라벨 비활성화 여부",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    className: {
      control: "text",
      description: "최상위 영역에 적용하는 클래스",
      table: { type: { summary: "string" } },
    },
    "aria-label": {
      control: "text",
      description: "label을 표시하지 않을 때 사용하는 접근성 이름",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledCheckbox(args: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = useState(args.checked);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked) => {
        setChecked(nextChecked);
        args.onCheckedChange(nextChecked);
      }}
    />
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: "라벨을 클릭하거나 키보드로 조작해 controlled 선택 상태를 확인합니다.",
      },
      source: { code: DEFAULT_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ControlledCheckbox {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", { name: "서비스 가능 지역" });

    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
    await expect(checkbox).toBeChecked();
  },
};

export const State: Story = {
  parameters: {
    docs: {
      description: { story: "선택 전, 선택됨, 비활성화 상태를 비교합니다." },
      source: { code: STATES_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="flex flex-col gap-12">
      <Checkbox checked={false} onCheckedChange={fn()} label={<Text>선택 안 됨</Text>} />
      <Checkbox checked onCheckedChange={fn()} label={<Text>선택됨</Text>} />
      <Checkbox disabled checked={false} onCheckedChange={fn()} label={<Text>비활성화</Text>} />
      <Checkbox disabled checked onCheckedChange={fn()} label={<Text>선택 후 비활성화</Text>} />
    </div>
  ),
};

export const ResponsiveLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: "label에 Text를 전달해 화면 크기에 따른 타이포그래피와 색상을 적용합니다.",
      },
      source: { code: CUSTOM_LABEL_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <Checkbox
      checked
      onCheckedChange={fn()}
      label={
        <Text as="span" variant={{ base: "md-regular", md: "lg-regular" }}>
          전체선택(2/5)
        </Text>
      }
      labelClassName="text-text-tertiary"
    />
  ),
};

export const WithoutVisibleLabel: Story = {
  parameters: {
    docs: {
      description: {
        story: "보이는 라벨이 없는 경우에서는 aria-label로 선택 대상을 설명합니다.",
      },
      source: { code: LABELLESS_SOURCE, language: "tsx" },
    },
  },
  args: {
    label: undefined,
    "aria-label": "김무빙 기사님 선택",
  },
  render: (args) => <ControlledCheckbox {...args} />,
};
