import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Select from "@/components/common/Select/Select";

const SELECT_SOURCE = `<Select
  desc="지역"
  label="지역 선택"
  defaultValue="seoul"
  onChange={setRegion}
>
  <Select.Option value="seoul">서울</Select.Option>
  <Select.Option value="gyeonggi">경기</Select.Option>
  <Select.Option value="incheon">인천</Select.Option>
</Select>`;

const meta = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "옵션 목록에서 하나의 값을 선택하는 컴포넌트입니다. `<Select>` 안에 `<Select.Option>`을 넣어 옵션 목록을 구성합니다. `default`는 일반 드롭다운, `sort`는 정렬 메뉴에 사용합니다. 열린 상태에서는 방향키로 옵션을 이동하고 Escape 키로 닫을 수 있습니다.",
      },
    },
  },
  args: {
    desc: "지역",
    label: "지역 선택",
    onChange: fn(),
    children: (
      <>
        <Select.Option value="seoul">서울</Select.Option>
        <Select.Option value="gyeonggi">경기</Select.Option>
        <Select.Option value="incheon">인천</Select.Option>
      </>
    ),
  },
  argTypes: {
    desc: { control: "text", description: "선택 전 또는 placeholderValue 선택 시 트리거 문구" },
    label: { control: "text", description: "combobox의 고정 접근성 이름" },
    size: { control: "inline-radio", options: ["sm", "lg"], description: "트리거 너비 규격" },
    variant: {
      control: "inline-radio",
      options: ["default", "sort"],
      description: "일반 선택 또는 정렬 메뉴 스타일",
      table: { defaultValue: { summary: "default" } },
    },
    columns: {
      control: "inline-radio",
      options: [1, 2],
      description: "옵션 목록 열 개수",
      table: { defaultValue: { summary: "1" } },
    },
    defaultValue: { control: "text", description: "처음 선택된 옵션 value" },
    placeholderValue: { control: "text", description: "선택해도 desc를 유지할 옵션 value" },
    onChange: { control: false, description: "옵션 선택 시 value를 전달하는 핸들러" },
    error: { control: "text", description: "드롭다운 아래에 표시할 오류 메시지" },
    disabled: { control: "boolean", description: "드롭다운 비활성화 여부" },
    children: { control: false, description: "Select.Option으로 구성한 옵션 목록" },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[280px] w-[min(560px,calc(100vw-48px))] pt-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { source: { code: SELECT_SOURCE, language: "tsx" } } },
};

export const Sort: Story = {
  args: {
    desc: "정렬",
    label: "정렬 기준",
    variant: "sort",
    size: "sm",
    children: (
      <>
        <Select.Option value="recent">최신순</Select.Option>
        <Select.Option value="rating">평점순</Select.Option>
      </>
    ),
  },
  parameters: { docs: { description: { story: "테두리와 그림자를 제거한 정렬 메뉴입니다." } } },
};

export const TwoColumns: Story = {
  args: {
    columns: 2,
    children: (
      <>
        {Array.from({ length: 12 }, (_, index) => (
          <Select.Option key={index} value={`area-${index + 1}`}>
            지역 {index + 1}
          </Select.Option>
        ))}
      </>
    ),
  },
  parameters: {
    docs: { description: { story: "지역처럼 옵션이 많을 때 2열 목록을 사용합니다." } },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[420px]">
        <Story />
      </div>
    ),
  ],
};
