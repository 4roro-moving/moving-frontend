import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Input from "@/components/common/Input/Input";

const INPUT_SOURCE = `<Input
  id="name"
  size="md"
  value={name}
  placeholder="이름을 입력해 주세요"
  onChange={(event) => setName(event.target.value)}
/>`;

const NUMERIC_SOURCE = `<Input
  inputMode="numeric"
  numericOnly
  value={price}
  placeholder="견적가 입력"
  onChange={(event) => setPrice(event.target.value)}
/>`;

const meta = {
  title: "UI/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
한 줄의 값을 입력받는 공통 필드입니다. \`sm\`은 모바일 기본 규격, \`md\`는 태블릿 이상에서 사용합니다. \`error\` prop을 통해 사용자에게 에러 메시지를 알립니다.
`,
      },
    },
  },
  args: {
    placeholder: "내용을 입력해 주세요",
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "입력 필드의 반응형 높이와 텍스트 크기",
      table: { defaultValue: { summary: "sm" } },
    },
    error: {
      control: "text",
      description: "필드 아래에 표시할 오류 메시지",
    },
    leftSlot: {
      control: false,
      description: "입력 영역 왼쪽에 배치할 콘텐츠",
    },
    rightSlot: {
      control: false,
      description: "입력 영역 오른쪽에 배치할 콘텐츠",
    },
    numericOnly: {
      control: "boolean",
      description: '입력 중 숫자가 아닌 문자를 자동으로 걸러냄 (`type="text"` 전제)',
    },
    stripLeadingZeros: {
      control: "boolean",
      description: "`numericOnly` 사용 시 앞자리 0을 자동으로 제거",
      table: { defaultValue: { summary: "true" } },
    },
    type: {
      control: "text",
      description: "input의 type 속성 (기본값 `text`)",
      table: {
        type: { summary: "HTMLInputTypeAttribute" },
        defaultValue: { summary: "text" },
      },
    },
    disabled: {
      control: "boolean",
      description: "입력 필드 비활성화 여부",
    },
    onChange: {
      control: false,
      description: "입력값 변경 핸들러",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(560px,calc(100vw_-_48px))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledInput(args: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState("");

  return (
    <Input
      {...args}
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        args.onChange?.(event);
      }}
    />
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: INPUT_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <ControlledInput {...args} />,
};

export const Error: Story = {
  args: {
    error: "입력 내용을 확인해 주세요.",
  },
  parameters: {
    docs: {
      description: {
        story: "error 전달 시 오류 테두리와 메시지를 표시합니다.",
      },
    },
  },
  render: (args) => <ControlledInput {...args} />,
};

export const NumericOnly: Story = {
  args: {
    numericOnly: true,
    inputMode: "numeric",
    placeholder: "숫자만 입력",
  },
  parameters: {
    docs: {
      description: {
        story: "금액처럼 숫자만 허용해야 하는 입력에 사용합니다.",
      },
      source: {
        code: NUMERIC_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <ControlledInput {...args} />,
};
