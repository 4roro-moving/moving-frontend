import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import Search from "@/components/common/Search/Search";

const SEARCH_SOURCE = `<form onSubmit={handleSearch}>
  <Search
    size="responsive"
    value={keyword}
    placeholder="검색어를 입력해 주세요"
    onChange={(event) => setKeyword(event.target.value)}
    onClear={() => setKeyword("")}
  />
</form>`;

const WITH_VALUE_SOURCE = `const [keyword, setKeyword] = useState("서울 이사");

<form onSubmit={(event) => event.preventDefault()}>
  <Search
    value={keyword}
    placeholder="검색어를 입력해 주세요"
    onChange={(event) => setKeyword(event.target.value)}
    onClear={() => setKeyword("")}
  />
</form>`;

const meta = {
  title: "UI/Search",
  component: Search,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "검색 아이콘, 입력 필드, 검색어 초기화 버튼을 포함하는 제어 컴포넌트입니다. `responsive` 크기는 모바일에서 sm, 태블릿부터 md 규격을 사용합니다.",
      },
    },
  },
  args: {
    placeholder: "검색어를 입력해 주세요",
    size: "responsive",
    onChange: fn(),
    onClear: fn(),
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "responsive"],
      description: "검색창의 높이, 너비, 아이콘과 텍스트 크기",
      table: { defaultValue: { summary: "md" } },
    },
    value: { control: false, description: "호출부에서 관리하는 검색어" },
    onChange: { control: false, description: "검색어 변경 핸들러" },
    onClear: { control: false, description: "검색어 지우기 버튼 클릭 핸들러" },
    placeholder: { control: "text", description: "검색어가 없을 때 표시할 안내 문구" },
    className: { control: "text", description: "검색창 너비나 배치를 확장하는 클래스" },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledSearch(args: React.ComponentProps<typeof Search>) {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Search
        {...args}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
          args.onChange?.(event);
        }}
        onClear={() => {
          setValue("");
          args.onClear?.();
        }}
        className={args.size === "responsive" ? "w-[min(560px,calc(100vw-48px))]" : undefined}
      />
    </form>
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      description: { story: "검색창에 포커스하거나 검색어를 입력해 상태 변화를 확인합니다." },
      source: { code: SEARCH_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <ControlledSearch {...args} />,
};

export const Sizes: Story = {
  parameters: {
    docs: { description: { story: "고정 크기인 sm과 md를 한 화면에서 비교합니다." } },
  },
  render: (args) => (
    <div className="flex flex-col gap-16">
      <ControlledSearch {...args} size="sm" />
      <ControlledSearch {...args} size="md" />
    </div>
  ),
};

export const WithValue: Story = {
  args: { defaultValue: undefined },
  parameters: {
    docs: {
      description: { story: "검색어 입력 후 지우기 버튼이 표시되는 상태입니다." },
      source: { code: WITH_VALUE_SOURCE, language: "tsx" },
    },
  },
  render: (args) => {
    function SearchWithInitialValue() {
      const [value, setValue] = useState("서울 이사");

      return (
        <form onSubmit={(event) => event.preventDefault()}>
          <Search
            {...args}
            value={value}
            autoFocus
            onChange={(event) => setValue(event.target.value)}
            onClear={() => setValue("")}
            className="w-[min(560px,calc(100vw-48px))]"
          />
        </form>
      );
    }

    return <SearchWithInitialValue />;
  },
};
