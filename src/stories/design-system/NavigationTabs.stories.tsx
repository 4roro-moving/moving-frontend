import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

import NavigationTabs from "@/components/common/NavigationTabs/NavigationTabs";

const NAVIGATION_TABS_DESCRIPTION = `한 화면 내에서 콘텐츠를 탭 단위로 전환할 수 있는 컴포넌트입니다. 현재 경로에 맞는 탭을 자동으로 활성화합니다.

### 경로 매칭

| match | 활성 조건 |
| --- | --- |
| \`prefix\` (기본값) | href와 같거나 하위 경로일 때. 탭의 상세 페이지에서도 같은 탭을 활성화할 때 사용합니다. |
| \`exact\` | href와 완전히 같을 때만. 상세 페이지를 탭의 하위 화면으로 보지 않을 때 사용합니다. |

`;

const DEFAULT_SOURCE = `const TABS = [
  { href: APP_ROUTES.ESTIMATES.PENDING, label: "대기 중인 견적" },
  { href: APP_ROUTES.ESTIMATES.RECEIVED, label: "받았던 견적" },
] as const;

<NavigationTabs ariaLabel="내 견적 관리" items={TABS} />`;

const EXACT_SOURCE = `const TABS = [
  { href: APP_ROUTES.MOVER_ESTIMATES.SENT, label: "보낸 견적 조회", match: "exact" },
  { href: APP_ROUTES.MOVER_ESTIMATES.REJECTED, label: "반려 요청", match: "exact" },
] as const;

<NavigationTabs ariaLabel="기사님 내 견적 관리" items={TABS} />`;

const ITEMS = [
  { href: "/estimates/pending", label: "대기 중인 견적", match: "prefix" },
  { href: "/estimates/received", label: "받았던 견적", match: "prefix" },
] as const;

const meta = {
  title: "Navigation/NavigationTabs",
  component: NavigationTabs,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/estimates/pending" } },
    docs: { description: { component: NAVIGATION_TABS_DESCRIPTION } },
  },
  args: {
    ariaLabel: "견적 관리",
    items: ITEMS,
  },
  argTypes: {
    ariaLabel: {
      control: "text",
      description: "탭 목록의 목적을 설명하는 nav 접근성 이름",
      table: { type: { summary: "string" } },
    },
    items: {
      control: false,
      description: "href, label, 선택적인 match 방식으로 구성한 탭 목록",
      table: { type: { summary: "readonly NavigationTabItem[]" } },
    },
    className: {
      control: "text",
      description: "탭 영역의 레이아웃이나 스타일을 확장하는 클래스",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof NavigationTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractiveNavigationTabs(args: React.ComponentProps<typeof NavigationTabs>) {
  const [pathname, setPathname] = useState(args.items[0]?.href ?? "/");

  return (
    <PathnameContext.Provider value={pathname}>
      <div
        onClickCapture={(event) => {
          const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");

          if (!link) return;

          event.preventDefault();
          setPathname(link.getAttribute("href") ?? pathname);
        }}
      >
        <NavigationTabs {...args} />
      </div>
    </PathnameContext.Provider>
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Controls에서 탭 영역의 접근성 이름과 레이아웃 클래스를 확인합니다. match를 생략하면 prefix 방식으로 동작합니다.",
      },
      source: { code: DEFAULT_SOURCE, language: "tsx" },
    },
  },
  render: (args) => <InteractiveNavigationTabs {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const receivedTab = canvas.getByRole("link", { name: "받았던 견적" });

    await userEvent.click(receivedTab);
    await expect(receivedTab).toHaveAttribute("aria-current", "page");
  },
};

export const ReceivedActive: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/estimates/received" } },
    docs: {
      description: { story: "pathname이 두 번째 탭과 일치해 해당 링크가 활성화된 상태입니다." },
      source: { code: DEFAULT_SOURCE, language: "tsx" },
    },
  },
};

export const PrefixMatching: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/estimates/pending/estimate-1" } },
    docs: {
      description: {
        story:
          "기본값인 prefix는 `/estimates/pending/estimate-1` 같은 상세 경로에서도 `/estimates/pending` 탭을 활성화합니다.",
      },
      source: { code: DEFAULT_SOURCE, language: "tsx" },
    },
  },
};

export const ExactMatching: Story = {
  args: {
    ariaLabel: "기사님 내 견적 관리",
    items: [
      { href: "/estimate/sent", label: "보낸 견적 조회", match: "exact" },
      { href: "/estimate/rejected", label: "반려 요청", match: "exact" },
    ],
  },
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/estimate/sent/estimate-1" } },
    docs: {
      description: {
        story:
          "`exact`는 `/estimate/sent/estimate-1` 같은 상세 경로에서는 탭을 활성화하지 않습니다. 상세 화면을 목록 탭의 하위 화면으로 취급하지 않을 때 사용합니다.",
      },
      source: { code: EXACT_SOURCE, language: "tsx" },
    },
  },
};

export const Overflow: Story = {
  args: {
    ariaLabel: "요청 상태",
    items: [
      { href: "/requests/all", label: "전체 요청" },
      { href: "/requests/pending", label: "대기 중인 요청" },
      { href: "/requests/confirmed", label: "확정된 요청" },
      { href: "/requests/completed", label: "완료된 요청" },
      { href: "/requests/canceled", label: "취소된 요청" },
    ],
  },
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/requests/all" } },
    docs: {
      description: {
        story: "좁은 viewport에서 탭이 영역을 초과하면 줄바꿈 대신 가로 스크롤됩니다.",
      },
    },
  },
};
