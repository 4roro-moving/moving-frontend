import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageHeader } from "@/components/common/PageHeader";

const PAGE_HEADER_DESCRIPTION =
  "페이지 상단에서 현재 화면의 제목을 보여주는 공통 헤더입니다. 모바일·태블릿은 54px, 데스크톱은 96px 높이를 사용합니다.";

const PAGE_HEADER_SOURCE = `import { PageHeader } from "@/components/common/PageHeader";

<PageHeader title="받은 요청" />`;

const meta = {
  title: "Layout/PageHeader",
  component: PageHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "Controls에서 화면 제목을 변경해 확인합니다." },
      source: { code: PAGE_HEADER_SOURCE, language: "tsx" },
    },
  },
};
