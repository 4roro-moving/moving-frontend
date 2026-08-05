import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import PasswordInput from "@/components/common/Input/PasswordInput";

const PASSWORD_SOURCE = `<PasswordInput
  id="password"
  size="md"
  value={password}
  placeholder="비밀번호를 입력해 주세요"
  autoComplete="current-password"
  onChange={(event) => setPassword(event.target.value)}
/>`;

const meta = {
  title: "UI/PasswordInput",
  component: PasswordInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Input을 기반으로 비밀번호 표시·숨김 기능을 제공하는 컴포넌트입니다. 우측 눈 아이콘 버튼은 현재 상태에 맞는 접근성 이름을 가집니다.",
      },
    },
  },
  args: {
    placeholder: "비밀번호를 입력해 주세요",
    size: "md",
    onChange: fn(),
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "Input과 동일한 크기 규격",
    },
    error: { control: "text", description: "필드 아래에 표시할 오류 메시지" },
    disabled: { control: "boolean", description: "비밀번호 입력 비활성화 여부" },
    autoComplete: {
      control: "text",
      description: "login은 current-password, signup은 new-password 권장",
    },
    onChange: { control: false, description: "비밀번호 변경 핸들러" },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(560px,calc(100vw-48px))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPasswordInput(args: React.ComponentProps<typeof PasswordInput>) {
  const [value, setValue] = useState("");

  return (
    <PasswordInput
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
  parameters: { docs: { source: { code: PASSWORD_SOURCE, language: "tsx" } } },
  render: (args) => <ControlledPasswordInput {...args} />,
};

export const Error: Story = {
  args: {
    defaultValue: "short",
    error: "비밀번호는 8자 이상 입력해 주세요.",
  },
  parameters: { docs: { description: { story: "Input의 error UI를 동일하게 사용합니다." } } },
};

export const ToggleVisibility: Story = {
  args: { defaultValue: "moving1234" },
  parameters: {
    docs: {
      description: { story: "눈 아이콘으로 password와 text 타입을 전환합니다." },
      source: { code: PASSWORD_SOURCE, language: "tsx" },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("비밀번호를 입력해 주세요");
    const toggle = canvas.getByRole("button", { name: "비밀번호 보이기" });

    await expect(input).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    await expect(input).toHaveAttribute("type", "text");
    await expect(canvas.getByRole("button", { name: "비밀번호 숨기기" })).toBeInTheDocument();
  },
};
