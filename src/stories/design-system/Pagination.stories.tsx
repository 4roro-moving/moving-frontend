import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Pagination from "@/components/common/Pagination/Pagination";

const PAGINATION_SOURCE = `const [page, setPage] = useState(1);

<Pagination currentPage={page} pageCount={9} onPageChange={setPage} />`;

const meta = {
  title: "Navigation/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "목록의 현재 페이지와 이동할 페이지를 선택하는 컴포넌트입니다. 화면 크기에 따라 표시하는 페이지 수가 달라지고, 생략 기호를 누르면 숨겨진 페이지를 선택할 수 있습니다.",
      },
    },
  },
  args: { currentPage: 1, pageCount: 9, onPageChange: fn() },
  argTypes: {
    currentPage: { control: "number", description: "현재 선택된 페이지. 1부터 시작합니다." },
    pageCount: { control: "number", description: "표시할 전체 페이지 수" },
    onPageChange: { control: false, description: "페이지 이동 시 선택된 페이지를 전달하는 핸들러" },
    className: { control: "text", description: "Pagination 영역의 레이아웃을 확장하는 클래스" },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPagination({
  currentPage = 1,
  onPageChange,
  ...args
}: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(currentPage);

  return (
    <Pagination
      {...args}
      currentPage={page}
      onPageChange={(nextPage) => {
        setPage(nextPage);
        onPageChange(nextPage);
      }}
    />
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "페이지 번호, 이전·다음 버튼, 생략 기호를 눌러 이동을 확인합니다." },
      source: { code: PAGINATION_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ControlledPagination {...args} />,
};

export const MiddlePage: Story = {
  args: { currentPage: 5, pageCount: 12 },
  parameters: {
    docs: {
      description: {
        story: "중간 페이지에서는 생략 기호로 접힌 페이지 목록을 확인할 수 있습니다.",
      },
      source: {
        code: `<Pagination currentPage={5} pageCount={12} onPageChange={setPage} />`,
        language: "tsx",
      },
    },
  },
  render: (args) => <ControlledPagination {...args} />,
};
