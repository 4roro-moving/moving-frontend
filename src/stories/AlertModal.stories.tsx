import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Button from "@/components/common/Button/Button";
import AlertModal from "@/components/common/Modal/AlertModal";
import Modal from "@/components/common/Modal/Modal";

const DEFAULT_SOURCE = `const [open, setOpen] = useState(false);

<AlertModal
  open={open}
  onClose={() => setOpen(false)}
  title="알림"
  description="작업이 정상적으로 완료되었습니다."
  primaryAction={{
    label: "확인",
    onClick: () => setOpen(false),
  }}
/>`;

const COMPACT_SOURCE = `const [open, setOpen] = useState(false);

<AlertModal
  open={open}
  onClose={() => setOpen(false)}
  size="sm"
  title="정말 삭제할까요?"
  description="삭제한 내용은 복구할 수 없습니다."
  primaryAction={{
    label: "확인",
    onClick: handleDelete,
  }}
/>`;

const CUSTOM_ACTIONS_SOURCE = `const [open, setOpen] = useState(false);

const close = () => {
  setOpen(false);
};

const handleConfirm = () => {
  onConfirm();
  close();
};

<AlertModal
  open={open}
  onClose={close}
  closeDisabled={isPending}
  size="sm"
  title="찜 해제 확인"
  description="찜한 기사님의 찜을 해제할까요?"
  actions={
    <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
      <Modal.Button
        variant="outline"
        size="cta"
        fullWidth
        disabled={isPending}
        onClick={close}
      >
        취소
      </Modal.Button>
      <Modal.Button
        size="cta"
        fullWidth
        disabled={isPending}
        onClick={handleConfirm}
      >
        확인
      </Modal.Button>
    </div>
  }
/>`;

const customConfirmAction = fn();

const meta = {
  title: "Overlay/AlertModal",
  component: AlertModal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "짧은 안내나 확인이 필요한 상황에 사용합니다. 단일 버튼은 `primaryAction`으로 구성하고, 취소·확인처럼 여러 버튼이 필요하면 `actions`로 버튼 영역을 직접 전달합니다.",
      },
    },
  },
  args: {
    open: false,
    title: "알림",
    description: "작업이 정상적으로 완료되었습니다.",
    onClose: fn(),
    primaryAction: {
      label: "확인",
      onClick: fn(),
    },
  },
  argTypes: {
    open: {
      control: false,
      description: "AlertModal 표시 여부",
      table: { type: { summary: "boolean" } },
    },
    title: {
      control: "text",
      description: "모달 상단에 표시하는 제목",
      table: { type: { summary: "ReactNode" } },
    },
    description: {
      control: "text",
      description: "제목 아래에 표시하는 안내 문구 또는 콘텐츠",
      table: { type: { summary: "ReactNode" } },
    },
    onClose: {
      control: false,
      description: "닫기 버튼, Escape, 오버레이 클릭 시 호출되는 핸들러",
      table: { type: { summary: "() => void" } },
    },
    closeDisabled: {
      control: "boolean",
      description: "처리 중일 때 닫기 동작과 닫기 버튼을 비활성화",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md"],
      description: "sm은 컴팩트 너비, md는 태블릿부터 608px 너비를 사용하는 반응형 크기",
      table: {
        type: { summary: "sm | md" },
        defaultValue: { summary: "md" },
      },
    },
    primaryAction: {
      control: false,
      description: "단일 기본 액션 버튼의 라벨, 클릭 핸들러, 비활성화 상태",
      table: { type: { summary: "AlertPrimaryAction" } },
    },
    actions: {
      control: false,
      description: "버튼 영역을 직접 구성하는 콘텐츠. 전달하면 primaryAction보다 우선함",
      table: { type: { summary: "ReactNode" } },
    },
  },
} satisfies Meta<typeof AlertModal>;

export default meta;

type Story = StoryObj<typeof meta>;

function AlertWithTrigger(args: React.ComponentProps<typeof AlertModal>) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    args.onClose?.();
  };

  return (
    <>
      <Button size="cta" onClick={() => setOpen(true)}>
        Alert 열기
      </Button>

      <AlertModal
        {...args}
        open={open}
        onClose={close}
        primaryAction={{
          ...args.primaryAction,
          label: args.primaryAction?.label ?? "확인",
          onClick: () => {
            args.primaryAction?.onClick();
            close();
          },
        }}
      />
    </>
  );
}

function AlertWithCustomActions(args: React.ComponentProps<typeof AlertModal>) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    args.onClose?.();
  };

  const handleConfirm = () => {
    customConfirmAction();
    close();
  };

  return (
    <>
      <Button size="cta" onClick={() => setOpen(true)}>
        Alert 열기
      </Button>

      <AlertModal
        {...args}
        open={open}
        onClose={close}
        primaryAction={undefined}
        actions={
          <div className="flex w-full flex-col-reverse gap-10 md:flex-row md:gap-12">
            <Modal.Button variant="outline" size="cta" fullWidth onClick={close}>
              취소
            </Modal.Button>

            <Modal.Button size="cta" fullWidth onClick={handleConfirm}>
              확인
            </Modal.Button>
          </div>
        }
      />
    </>
  );
}

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: "제목, 설명, 하나의 기본 액션으로 구성한 일반적인 Alert입니다.",
      },
      source: {
        code: DEFAULT_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <AlertWithTrigger {...args} />,
};

export const Compact: Story = {
  args: {
    size: "sm",
    title: "정말 삭제할까요?",
    description: "삭제한 내용은 복구할 수 없습니다.",
  },
  parameters: {
    docs: {
      description: {
        story: "화면 크기와 관계없이 작은 너비를 유지하는 컴팩트 Alert입니다.",
      },
      source: {
        code: COMPACT_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <AlertWithTrigger {...args} />,
};

export const CustomActions: Story = {
  args: {
    size: "sm",
    title: "찜 해제 확인",
    description: "찜한 기사님의 찜을 해제할까요?",
    primaryAction: undefined,
    actions: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`actions`를 사용해 취소와 확인 버튼을 직접 구성하고, 각 버튼에 닫기 및 확인 동작을 연결한 예시입니다.",
      },
      source: {
        code: CUSTOM_ACTIONS_SOURCE,
        language: "tsx",
      },
    },
  },
  render: (args) => <AlertWithCustomActions {...args} />,
};
