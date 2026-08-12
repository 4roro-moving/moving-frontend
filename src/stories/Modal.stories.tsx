import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Button from "@/components/common/Button/Button";
import Modal from "@/components/common/Modal/Modal";

const RESPONSIVE_SOURCE = `const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  presentation="responsive"
  size="md"
  className="items-stretch gap-30 px-24 pt-32 pb-40 text-left xl:gap-40"
>
    <div className="flex items-center justify-between gap-12">
      <Modal.Title>모달 제목</Modal.Title>
      <Modal.Close onClose={() => setOpen(false)} />
    </div>

    <Modal.Desc>모달에 필요한 설명이나 콘텐츠가 들어갑니다.</Modal.Desc>

    <Modal.Button fullWidth size="cta" onClick={() => setOpen(false)}>
      확인
    </Modal.Button>
</Modal>`;

const BOTTOM_SHEET_SOURCE = `const [open, setOpen] = useState(false);

<Modal
  open={open}
  onClose={() => setOpen(false)}
  presentation="bottom-sheet"
  className="items-stretch gap-30 px-24 pt-32 pb-40 text-left"
>
    <div className="flex items-center justify-between gap-12">
      <Modal.Title>바텀시트 제목</Modal.Title>
      <Modal.Close size="sm" onClose={() => setOpen(false)} />
    </div>

    <Modal.Desc>바텀시트에 필요한 콘텐츠가 들어갑니다.</Modal.Desc>

    <Modal.Button fullWidth size="cta" onClick={() => setOpen(false)}>
      확인
    </Modal.Button>
</Modal>`;

const meta = {
  title: "Overlay/Modal",
  component: Modal,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
\`Modal.Title\`, \`Modal.Desc\`, \`Modal.Close\`, \`Modal.Button\`을 조합해 사용하는 공통 모달입니다. 열려 있는 동안 배경 페이지의 스크롤을 막으며, 키보드 포커스를 모달 내부에 유지합니다. Escape 키나 바깥 영역을 눌러 닫을 수 있습니다.
  `,
      },
    },
  },
  args: {
    children: null,
    onClose: fn(),
    onExitComplete: fn(),
    presentation: "responsive",
    size: "md",
  },
  argTypes: {
    open: {
      control: false,
      description: "모달 표시 여부. false가 되면 종료 모션 후 언마운트됩니다.",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
    },
    onExitComplete: {
      control: false,
      description: "종료 모션이 완료되어 모달이 언마운트되기 직전에 호출되는 핸들러",
      table: { type: { summary: "() => void" } },
    },
    presentation: {
      control: "inline-radio",
      options: ["modal", "bottom-sheet", "responsive"],
      description: "모달 패널이 화면에 배치되는 방식",
      table: {
        type: { summary: "modal | bottom-sheet | responsive" },
        defaultValue: { summary: "modal" },
      },
    },
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
      description: "패널 너비. presentation과 화면 크기에 따라 반응형으로 적용",
      table: {
        type: { summary: "sm | md | lg" },
      },
    },
    children: {
      control: false,
      description: "모달 패널 내부에 렌더링할 콘텐츠",
      table: { type: { summary: "ReactNode" } },
    },
    onClose: {
      control: false,
      description: "Escape 또는 오버레이 클릭 시 호출되는 닫기 핸들러",
      table: { type: { summary: "() => void" } },
    },
    className: {
      control: "text",
      description: "모달 패널의 간격, 패딩 등 스타일을 확장하는 클래스",
      table: { type: { summary: "string" } },
    },
    overlayClassName: {
      control: false,
      description: "전체 화면 오버레이의 스타일을 확장하는 클래스",
      table: { type: { summary: "string" } },
    },
    dismissible: {
      control: "boolean",
      description: "Escape 키 또는 오버레이 클릭으로 모달을 닫을지 여부",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "true" } },
    },
    "aria-label": {
      control: "text",
      description: "Modal.Title을 사용하지 않을 때 dialog에 제공하는 접근성 이름",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalWithTrigger(args: React.ComponentProps<typeof Modal>) {
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    args.onClose?.();
  };

  return (
    <>
      <Button size="cta" onClick={() => setOpen(true)}>
        모달 열기
      </Button>
      <Modal
        {...args}
        open={open}
        onClose={close}
        className="items-stretch gap-30 px-24 pt-32 pb-40 text-left xl:gap-40"
      >
        <div className="flex items-center justify-between gap-12">
          <Modal.Title>모달 제목</Modal.Title>
          <Modal.Close onClose={close} />
        </div>
        <Modal.Desc>모달에 필요한 설명이나 콘텐츠가 들어갑니다.</Modal.Desc>
        <Modal.Button fullWidth size="cta" onClick={close}>
          확인
        </Modal.Button>
      </Modal>
    </>
  );
}

export const Responsive: Story = {
  parameters: {
    docs: {
      description: {
        story: "모바일에서는 하단 바텀시트, 태블릿 이상에서는 중앙 모달로 전환됩니다.",
      },
      source: { code: RESPONSIVE_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ModalWithTrigger {...args} />,
};

export const BottomSheet: Story = {
  args: { presentation: "bottom-sheet", size: undefined },
  parameters: {
    docs: {
      description: {
        story: "화면 크기와 관계없이 하단에 붙고 전체 너비를 사용하는 바텀시트입니다.",
      },
      source: { code: BOTTOM_SHEET_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ModalWithTrigger {...args} />,
};
