import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Footer from "@/components/common/Footer/Footer";

const meta = {
  title: "Layout/Footer",
  component: Footer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "서비스 로고, 고객지원 링크, 저작권 정보를 제공하는 공통 푸터입니다. 페이지 너비에 맞춰 내부 여백이 반응형으로 적용됩니다.",
      },
    },
  },
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
