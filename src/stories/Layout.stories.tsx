import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "@/components/common/Text";

const LAYOUT_DESCRIPTION = `화면 구조에서 반복되는 breakpoint, 페이지 여백, container, 상단 영역 높이를 정의합니다.

### Breakpoints

| 구간 | Viewport | Tailwind prefix |
| --- | --- | --- |
| Mobile | 0–767px | base |
| Tablet | 768–1279px | \`md:\` |
| Desktop | 1280px 이상 | \`xl:\` |

Mobile/Tablet은 좌우 margin(24px/72px), Desktop은 1200px 또는 1120px container로 정렬합니다. GNB·Tab·PageHeader 같은 반복 상단 영역은 공통 height 토큰을 씁니다.

여러 화면에서 반복되는 큰 구조를 통일하기 위한 기준으로, Auth·랜딩처럼 구조가 다른 화면은 해당 패턴을 우선합니다.`;

const PAGE_LAYOUT_SOURCE = `<main className="px-margin-mobile md:px-margin-tablet xl:px-0">
  <div className="max-w-container-desktop mx-auto w-full">
    {children}
  </div>
</main>`;

interface LayoutValue {
  name: string;
  mobile: string;
  tablet: string;
  desktop: string;
  description: string;
}

const HEADER_HEIGHTS: LayoutValue[] = [
  { name: "GNB", mobile: "54px", tablet: "54px", desktop: "88px", description: "전역 헤더" },
  { name: "Tab", mobile: "54px", tablet: "54px", desktop: "80px", description: "상단 탭" },
  {
    name: "Page Header",
    mobile: "54px",
    tablet: "54px",
    desktop: "96px",
    description: "페이지 내부 헤더",
  },
];

const meta = {
  title: "Foundations/Layout",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: { description: { component: LAYOUT_DESCRIPTION } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MobileTabletMargins: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "고정 container 없이 좌우 margin만 적용됩니다. Canvas를 768px 이상으로 늘려 margin 변화를 확인하세요.",
      },
      source: { code: PAGE_LAYOUT_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="bg-background-muted flex min-h-[400px] w-full flex-col gap-24 py-32 xl:px-40">
      <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col gap-4 xl:px-0">
        <Text variant="xl-semibold" className="text-text-primary">
          Mobile · Tablet 콘텐츠 영역
        </Text>
        <Text variant="md-regular" className="text-text-muted xl:hidden">
          현재 좌우 margin: <span className="md:hidden">24px</span>
          <span className="hidden md:inline">72px</span>
        </Text>
        <Text variant="md-regular" className="text-text-muted hidden xl:block">
          Desktop 구간에서는 아래 margin pattern 대신 고정 container를 사용합니다.
        </Text>
      </div>

      <div className="flex w-full xl:hidden">
        <div className="bg-background-brand-muted border-border-brand w-margin-mobile md:w-margin-tablet flex shrink-0 items-center justify-center border-y border-r border-dashed">
          <Text
            variant="xs-semibold"
            className="text-text-brand hidden whitespace-nowrap md:block md:-rotate-90"
          >
            72px
          </Text>
        </div>

        <div className="border-border-default bg-background-surface flex min-h-[220px] min-w-0 flex-1 flex-col items-center justify-center gap-8 border-y border-dashed px-12 text-center">
          <Text variant="lg-semibold" className="text-text-primary">
            width: 100%
          </Text>
          <Text variant="md-regular" className="text-text-muted md:hidden">
            viewport − 48px
          </Text>
          <Text variant="md-regular" className="text-text-muted hidden md:block">
            viewport − 144px
          </Text>
          <Text variant="xs-regular" className="text-text-subtle">
            별도의 Tablet 고정 container 없음
          </Text>
        </div>

        <div className="bg-background-brand-muted border-border-brand w-margin-mobile md:w-margin-tablet flex shrink-0 items-center justify-center border-y border-l border-dashed">
          <Text
            variant="xs-semibold"
            className="text-text-brand hidden whitespace-nowrap md:block md:rotate-90"
          >
            72px
          </Text>
        </div>
      </div>

      <div className="px-margin-mobile flex w-full items-center justify-between md:hidden">
        <Text variant="xs-semibold" className="text-text-brand">
          ← 24px
        </Text>
        <Text variant="xs-semibold" className="text-text-brand">
          24px →
        </Text>
      </div>

      <div className="px-margin-mobile md:px-margin-tablet hidden w-full xl:block xl:px-0">
        <div className="border-border-subtle rounded-12 bg-background-surface flex min-h-[160px] items-center justify-center border p-24 text-center">
          <Text variant="md-medium" className="text-text-muted">
            Canvas를 Mobile 또는 Tablet viewport로 변경해 margin 구조를 확인하세요.
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const DesktopContainers: Story = {
  parameters: {
    docs: {
      description: {
        story: "Desktop에서는 margin 대신 1200px 또는 1120px container를 중앙 정렬합니다.",
      },
      source: { code: PAGE_LAYOUT_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="bg-background-muted flex min-h-[420px] w-full flex-col gap-32 px-24 py-32">
      <div className="max-w-container-desktop mx-auto flex w-full flex-col gap-8">
        <div className="flex items-center justify-between gap-16">
          <Text variant="lg-semibold" className="text-text-primary">
            Default container
          </Text>
          <Text variant="md-medium" className="text-text-brand">
            max 1200px
          </Text>
        </div>
        <div className="bg-background-brand-muted border-border-brand rounded-12 flex h-112 w-full items-center justify-center border border-dashed">
          <Text variant="md-semibold" className="text-text-brand">
            max-w-container-desktop · mx-auto · w-full
          </Text>
        </div>
      </div>

      <div className="max-w-container-desktop-narrow mx-auto flex w-full flex-col gap-8">
        <div className="flex items-center justify-between gap-16">
          <Text variant="lg-semibold" className="text-text-primary">
            Narrow container
          </Text>
          <Text variant="md-medium" className="text-text-secondary">
            max 1120px
          </Text>
        </div>
        <div className="bg-background-surface border-border-default rounded-12 flex h-96 w-full items-center justify-center border border-dashed">
          <Text variant="md-semibold" className="text-text-secondary">
            max-w-container-desktop-narrow · mx-auto · w-full
          </Text>
        </div>
      </div>
    </div>
  ),
};

export const HeaderHeights: Story = {
  parameters: {
    docs: {
      description: {
        story: "GNB·Tab·PageHeader의 반복 높이입니다. Desktop에서만 높이가 확장됩니다.",
      },
    },
  },
  render: () => (
    <div className="px-margin-mobile md:px-margin-tablet flex w-full flex-col gap-16 py-32 xl:px-40">
      {HEADER_HEIGHTS.map((item) => (
        <div
          key={item.name}
          className="border-border-subtle grid gap-8 border-b pb-16 md:grid-cols-[140px_repeat(3,1fr)] md:items-center"
        >
          <div className="flex flex-col gap-2">
            <Text variant="md-semibold" className="text-text-primary">
              {item.name}
            </Text>
            <Text variant="xs-regular" className="text-text-muted">
              {item.description}
            </Text>
          </div>
          <Text variant="md-regular" className="text-text-secondary">
            Mobile {item.mobile}
          </Text>
          <Text variant="md-regular" className="text-text-secondary">
            Tablet {item.tablet}
          </Text>
          <Text variant="md-regular" className="text-text-secondary">
            Desktop {item.desktop}
          </Text>
        </div>
      ))}
    </div>
  ),
};
