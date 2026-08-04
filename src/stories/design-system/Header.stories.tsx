import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Header from "@/components/common/Header/Header";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});
queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT, { unreadCount: 0 });

const meta = {
  title: "Layout/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/" },
    },
    docs: {
      description: {
        component:
          "로그인 여부와 사용자 역할에 따라 내비게이션을 구성하는 공통 헤더입니다. 모바일·태블릿에서는 메뉴 버튼과 우측 드로어를 사용하고, 데스크톱에서는 전체 메뉴를 표시합니다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <div className="bg-background-muted min-h-[360px] w-full">
          <Story />
        </div>
      </QueryClientProvider>
    ),
  ],
  beforeEach: () => {
    useAuthStore.setState({
      user: null,
      displayName: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      hasHydrated: false,
    });
  },
  argTypes: {
    initialRole: { control: "inline-radio", options: ["CUSTOMER", "MOVER"] },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: { isLogin: false },
};

export const Customer: Story = {
  args: {
    isLogin: true,
    initialNickname: "무빙고객",
    initialRole: "CUSTOMER",
  },
};

export const Mover: Story = {
  args: {
    isLogin: true,
    initialNickname: "김무빙",
    initialRole: "MOVER",
  },
};
