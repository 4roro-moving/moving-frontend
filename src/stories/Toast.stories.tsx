import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Toast/Toast";

const TOAST_SOURCE = `const [toastMessage, setToastMessage] = useState<string | null>(null);

<Button onClick={() => setToastMessage("견적 요청을 취소했어요")}>토스트 열기</Button>
{toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}`;

const meta = {
  title: "Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "작업 결과를 짧게 알리는 컴포넌트입니다. 메시지를 전달해 조건부로 렌더링하면 3초 뒤 자동으로 닫히며, `onClose`에서 부모 상태를 정리합니다.",
      },
    },
  },
  args: { children: "견적 요청을 취소했어요", onClose: fn() },
  argTypes: {
    children: { control: "text", description: "Toast에 표시할 알림 문구" },
    onClose: { control: false, description: "3초 후 Toast를 제거하는 핸들러" },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastTrigger({ children, onClose }: React.ComponentProps<typeof Toast>) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Button size="md" onClick={() => setMessage(String(children))}>
        토스트 열기
      </Button>
      {message ? (
        <Toast
          onClose={() => {
            setMessage(null);
            onClose();
          }}
        >
          {message}
        </Toast>
      ) : null}
    </div>
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      source: { code: TOAST_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ToastTrigger {...args} />,
};
