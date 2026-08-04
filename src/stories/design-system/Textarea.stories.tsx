import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Textarea from "@/components/common/Input/Textarea";

const TEXTAREA_SOURCE = `<Textarea
  id="comment"
  aria-label="후기 내용"
  value={comment}
  maxLength={1000}
  placeholder="최소 10자 이상 입력해 주세요."
  onChange={(event) => setComment(event.target.value)}
/>`;

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "여러 줄 텍스트를 입력받는 공통 필드입니다. 기본 높이는 180px이며 호출부의 className으로 필요한 높이를 지정할 수 있습니다. 검증 메시지는 error로 전달합니다.",
      },
    },
  },
  args: {
    "aria-label": "후기 내용",
    placeholder: "최소 10자 이상 입력해 주세요.",
    onChange: fn(),
  },
  argTypes: {
    "aria-label": {
      control: "text",
      description: "Textarea의 입력 목적을 설명하는 접근성 이름",
    },
    error: {
      control: "text",
      description: "필드 아래에 표시할 오류 메시지",
    },
    className: {
      control: "text",
      description: "높이, resize, padding 등을 확장하는 클래스",
    },
    maxLength: {
      control: "number",
      description: "입력 가능한 최대 글자 수",
    },
    disabled: {
      control: "boolean",
      description: "텍스트 영역 비활성화 여부",
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
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

function ControlledTextarea(args: React.ComponentProps<typeof Textarea>) {
  const [value, setValue] = useState("");

  return (
    <Textarea
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
        code: TEXTAREA_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <ControlledTextarea {...args} />,
};

export const Error: Story = {
  args: {
    error: "10자 이상 1,000자 이하로 입력해 주세요.",
  },
  parameters: {
    docs: {
      description: {
        story: "error 전달 시 오류 테두리와 메시지를 표시합니다.",
      },
    },
  },
  render: (args) => <ControlledTextarea {...args} />,
};

export const CustomHeight: Story = {
  args: {
    className: "h-[160px]",
  },
  parameters: {
    docs: {
      description: {
        story: "모달 등 사용처에 맞춰 className으로 높이를 변경합니다.",
      },
    },
  },
  render: (args) => <ControlledTextarea {...args} />,
};
