import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import Header from "@/components/common/Header/Header";
import { NOTIFICATION_PAGE_SIZE } from "@/lib/api/notifications";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAuthStore } from "@/stores/useAuthStore";
import type { NotificationListResponse } from "@/types/notification";

const notificationListFixture = {
  notifications: [
    {
      id: 1,
      type: "ESTIMATE_REQUEST_RECEIVED",
      title: "견적 요청 알림",
      content: "김무빙 고객님의",
      linkUrl: null,
      isRead: false,
      readAt: null,
      expiresAt: null,
      createdAt: "2026-08-10T04:00:00.000Z",
    },
    {
      id: 2,
      type: "CHAT_MESSAGE_RECEIVED",
      title: "새 메시지 알림",
      content: "튼튼이사",
      linkUrl: null,
      isRead: false,
      readAt: null,
      expiresAt: null,
      createdAt: "2026-08-10T03:30:00.000Z",
    },
    {
      id: 3,
      type: "REVIEW_RECEIVED",
      title: "리뷰 작성 알림",
      content: "이사 서비스 리뷰",
      linkUrl: null,
      isRead: true,
      readAt: "2026-08-10T02:00:00.000Z",
      expiresAt: null,
      createdAt: "2026-08-10T02:00:00.000Z",
    },
  ],
  pagination: {
    page: 1,
    limit: NOTIFICATION_PAGE_SIZE,
    totalCount: 3,
    totalPages: 1,
    hasNextPage: false,
  },
} satisfies NotificationListResponse;

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: Infinity } },
});
// UNREAD_COUNT는 authScope("guest" | "authenticated-unresolved" | `user:${string}`)에 따라
// 캐시 키가 달라지는 factory 함수라 호출해서 실제 키 배열을 넘겨야 합니다.
queryClient.setQueryData(QUERY_KEYS.NOTIFICATIONS.UNREAD_COUNT("guest"), { unreadCount: 2 });
queryClient.setQueryData(
  QUERY_KEYS.NOTIFICATIONS.LIST("guest", 1, NOTIFICATION_PAGE_SIZE),
  notificationListFixture,
);

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
