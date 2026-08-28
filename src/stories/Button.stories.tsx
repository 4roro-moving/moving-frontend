import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Button from "@/components/common/Button/Button";
import { WriteIcon } from "@/icons";

const BUTTON_DESCRIPTION = `서비스 전반의 주요 액션에 사용하는 공통 버튼입니다. 

### Variant

- \`solid\`: 완료, 제출, 다음 단계처럼 화면의 주요 액션에 사용합니다.
- \`outline\`: 취소, 이전, 보조 액션처럼 주요 액션보다 낮은 위계에 사용합니다.

### Size

| Size | 규격 | 주요 사용처 |
| --- | --- | --- |
| \`sm\` | 57px / min-width 300px | 작은 고정 너비 페이지 버튼 |
| \`md\` | 57px / min-width 600px | 큰 고정 너비 페이지 버튼 |
| \`cta\` | 54px / radius 12px | 카드·모달 등 일반 CTA |
| \`detail\` | 64px / full width | 데스크톱 상세 화면의 주요 CTA |
| \`auth\` | Mobile 54px, Tablet+ 60px / full width | 로그인·회원가입 CTA |

### Link

- \`href\`를 전달하면 동일한 디자인을 유지한 채 Next.js \`Link\`로 렌더링합니다.
- 링크에도 \`disabled\`를 사용할 수 있으며, 이 경우 이동과 키보드 포커스가 차단됩니다.

`;

const PLAYGROUND_SOURCE = `<Button variant="solid" size="cta" onClick={handleClick}>
  버튼
</Button>`;

const VARIANTS_SOURCE = `<div className="flex gap-12">
  <Button size="cta" variant="outline" onClick={onCancel}>
    취소
  </Button>
  <Button size="cta" variant="solid" onClick={onConfirm}>
    확인
  </Button>
</div>`;

const ICON_SOURCE = `<Button
  size="cta"
  rightIcon={<WriteIcon className="size-24" />}
  onClick={handleSendEstimate}
>
  견적 보내기
</Button>`;

const AUTH_SOURCE = `<Button type="submit" size="auth" fullWidth disabled={isPending}>
  {isPending ? "로그인 중..." : "로그인"}
</Button>`;

const LINK_SOURCE = `<Button href="/movers" variant="outline" size="detail" fullWidth>
  기사님 목록 보기
</Button>`;

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: BUTTON_DESCRIPTION } },
  },
  args: {
    children: "버튼",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["solid", "outline"],
      description: "버튼의 시각적 위계",
      table: {
        type: { summary: "solid | outline" },
        defaultValue: { summary: "solid" },
      },
    },
    size: {
      control: "select",
      options: ["sm", "md", "cta", "detail", "auth"],
      description: "사용 맥락에 따른 높이, 너비, radius와 텍스트 크기",
      table: {
        type: { summary: "sm | md | cta | detail | auth" },
        defaultValue: { summary: "md" },
      },
    },
    fullWidth: {
      control: "boolean",
      description: "부모 영역의 전체 너비를 사용할지 여부",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    href: {
      control: "text",
      description: "전달하면 Next.js Link로 렌더링할 이동 경로",
      table: { type: { summary: "LinkProps['href']" } },
    },
    rightIcon: {
      control: false,
      description: "버튼 텍스트 오른쪽에 표시할 아이콘 또는 콘텐츠",
      table: { type: { summary: "ReactNode" } },
    },
    children: {
      control: "text",
      description: "버튼에 표시할 텍스트 또는 콘텐츠",
      table: { type: { summary: "ReactNode" } },
    },
    type: {
      control: "inline-radio",
      options: ["button", "submit", "reset"],
      description: "HTML button type. 폼 제출 시 submit을 명시",
      table: { defaultValue: { summary: "button" } },
    },
    disabled: {
      control: "boolean",
      description: "버튼 비활성화 여부",
      table: { type: { summary: "boolean" }, defaultValue: { summary: "false" } },
    },
    onClick: {
      control: false,
      description: "버튼 클릭 핸들러",
      table: { type: { summary: "MouseEventHandler<HTMLButtonElement>" } },
    },
    className: {
      control: "text",
      description: "버튼의 레이아웃이나 스타일을 확장하는 클래스",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "Controls에서 variant, size, 상태와 내용을 변경합니다." },
      source: { code: PLAYGROUND_SOURCE, language: "tsx" },
    },
  },
};

export const Variants: Story = {
  parameters: {
    docs: {
      description: {
        story: "주요 액션인 solid와 보조 액션인 outline, disabled 상태를 비교합니다.",
      },
      source: { code: VARIANTS_SOURCE, language: "tsx" },
    },
  },
  render: (args) => (
    <div className="flex flex-col gap-16">
      <Button {...args} size="cta" variant="solid">
        Solid
      </Button>
      <Button {...args} size="cta" variant="outline">
        Outline
      </Button>
      <Button {...args} size="cta" disabled>
        Disabled
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-[min(680px,calc(100vw-48px))] flex-col items-stretch gap-16 overflow-x-auto">
      <Button {...args} size="sm">
        sm · 57px
      </Button>
      <Button {...args} size="md">
        md · 57px
      </Button>
      <Button {...args} size="cta">
        cta · 54px
      </Button>
      <Button {...args} size="detail">
        detail · 64px
      </Button>
      <Button {...args} size="auth">
        auth · Mobile 54px / Tablet+ 60px
      </Button>
    </div>
  ),
};

export const WithRightIcon: Story = {
  parameters: {
    docs: {
      description: { story: "rightIcon으로 텍스트 오른쪽에 아이콘을 배치합니다." },
      source: { code: ICON_SOURCE, language: "tsx" },
    },
  },
  args: {
    size: "cta",
    children: "견적 보내기",
    rightIcon: <WriteIcon className="size-24" />,
  },
};

export const WithLink: Story = {
  args: {
    href: "/movers",
    variant: "outline",
    size: "detail",
    fullWidth: true,
    children: "기사님 목록 보기",
  },
  parameters: {
    docs: {
      description: { story: "href를 전달하면 버튼 디자인의 링크로 사용할 수 있습니다." },
      source: { code: LINK_SOURCE, language: "tsx" },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(600px,calc(100vw-48px))]">
        <Story />
      </div>
    ),
  ],
};

export const ResponsiveAuth: Story = {
  args: { size: "auth", fullWidth: true, children: "로그인" },
  parameters: {
    docs: {
      description: {
        story:
          "인증 화면 전용 버튼입니다. 모바일에서는 54px, 태블릿부터 60px 높이와 더 큰 텍스트를 사용합니다.",
      },
      source: { code: AUTH_SOURCE, language: "tsx" },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(600px,calc(100vw-48px))]">
        <Story />
      </div>
    ),
  ],
};
