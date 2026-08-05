import { useState } from "react";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import { FavoriteButton } from "@/components/mover/FavoriteButton";

const FAVORITE_BUTTON_DESCRIPTION = "기사님을 찜한 여부와 찜 개수를 확인하는 컴포넌트입니다";

const meta = {
  title: "Domain/FavoriteButton",
  component: FavoriteButton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: { description: { component: FAVORITE_BUTTON_DESCRIPTION } },
  },
  args: {
    moverName: "김무빙",
    isFavorite: false,
    onToggle: fn(),
  },
  argTypes: {
    moverName: {
      control: "text",
      description: "접근성 라벨에 사용할 기사님 이름",
    },
    isFavorite: {
      control: "boolean",
      description: "현재 찜 여부",
    },
    favoriteCount: {
      control: "number",
      description: "찜 개수. showCount와 함께 사용",
    },
    showCount: {
      control: "boolean",
      description: "찜 개수 표시 여부",
    },
    interactive: {
      control: "boolean",
      description:
        "클릭 가능 여부. 같은 화면에서 토글 가능 여부가 갈리는 경우(비로그인 노출 등)에만 명시적으로 전달",
      table: { defaultValue: { summary: "true" } },
    },
    countPosition: {
      control: "inline-radio",
      options: ["before", "after"],
      description: "아이콘 기준 개수 표시 위치",
    },
    countVariant: {
      control: false,
      description: "찜 개수 텍스트의 타이포그래피 variant",
      table: { defaultValue: { summary: "md-regular" } },
    },
    className: {
      control: "text",
      description: "버튼(또는 읽기 전용 group) 최상위 요소의 레이아웃·스타일을 확장하는 클래스",
    },
    iconClassName: {
      control: "text",
      description: "하트 아이콘의 크기 등을 확장하는 클래스",
      table: { defaultValue: { summary: "size-24" } },
    },
    countClassName: {
      control: "text",
      description: "찜 개수 텍스트의 색상 등을 확장하는 클래스",
    },
    onToggle: {
      control: false,
      description: "찜 토글 시 호출되는 핸들러. interactive가 true일 때 버튼 클릭으로 호출됨",
    },
  },
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    showCount: true,
    favoriteCount: 12,
  },
  parameters: {
    docs: {
      description: {
        story: "클릭 시 하트 색과 찜 개수가 함께 바뀌는 걸 확인할 수 있습니다.",
      },
    },
  },
  render: function Render(args) {
    const [isFavorite, setIsFavorite] = useState(args.isFavorite);
    const [favoriteCount, setFavoriteCount] = useState(args.favoriteCount ?? 0);

    return (
      <FavoriteButton
        {...args}
        isFavorite={isFavorite}
        favoriteCount={favoriteCount}
        onToggle={(next) => {
          setIsFavorite(next);
          setFavoriteCount((count) => count + (next ? 1 : -1));
          args.onToggle?.(next);
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /^김무빙 기사님 찜/ });

    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(canvas.getByText("12")).toBeInTheDocument();

    await userEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(canvas.getByText("13")).toBeInTheDocument();
    });

    await userEvent.click(button);
    await waitFor(() => {
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(canvas.getByText("12")).toBeInTheDocument();
    });
  },
};

export const Favorited: Story = {
  args: { isFavorite: true },
  parameters: {
    docs: { description: { story: "찜한 상태입니다. 하트가 채워진 색으로 표시됩니다." } },
  },
};

export const WithCount: Story = {
  args: { showCount: true, favoriteCount: 12 },
  parameters: {
    docs: { description: { story: "찜 개수를 하트 뒤에 표시합니다." } },
  },
};

export const CountBeforeIcon: Story = {
  args: { showCount: true, favoriteCount: 12, countPosition: "before" },
  parameters: {
    docs: { description: { story: "찜 개수를 하트 앞에 표시합니다." } },
  },
};
