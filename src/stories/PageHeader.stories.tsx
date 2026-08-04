import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageHeader } from "@/components/common/PageHeader";

const PAGE_HEADER_DESCRIPTION = `페이지 상단에서 현재 화면의 제목을 보여주는 공통 헤더입니다.

\`backFallbackHref\`나 \`actions\`가 있으면 세로로 여백을 두는 레이아웃(뒤로가기 버튼 + 제목 줄)으로, 둘 다 없으면 제목만 있는 고정 높이(모바일·태블릿 54px / 데스크톱 96px) 레이아웃으로 전환됩니다.`;

const PAGE_HEADER_SOURCE = `import { PageHeader } from "@/components/common/PageHeader";

<PageHeader title="받은 요청" />`;

const WITH_BACK_SOURCE = `<PageHeader title="기사님 상세" backFallbackHref="/movers" />`;

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/movers/123" } },
    docs: { description: { component: PAGE_HEADER_DESCRIPTION } },
  },
  args: {
    title: "받은 요청",
  },
  argTypes: {
    title: {
      control: "text",
      description: "페이지 제목으로 표시할 텍스트",
      table: { type: { summary: "string" } },
    },
    backFallbackHref: {
      control: "text",
      description:
        "뒤로가기 버튼 노출 여부와 폴백 경로. 값이 있으면 제목 위에 뒤로가기 버튼이 표시됩니다.",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "제목만 있는 기본 상태입니다. 고정 높이 레이아웃을 사용합니다." },
      source: { code: PAGE_HEADER_SOURCE, language: "tsx" },
    },
  },
};

export const WithBackButton: Story = {
  args: {
    title: "기사님 상세",
    backFallbackHref: "/movers",
  },
  parameters: {
    docs: {
      description: {
        story:
          "뒤로가기 버튼이 있는 상태입니다. 같은 사이트에서 온 이력이 있으면 이전 페이지로, 없으면(딥링크 등) `backFallbackHref`로 이동합니다.",
      },
      source: { code: WITH_BACK_SOURCE, language: "tsx" },
    },
  },
};
