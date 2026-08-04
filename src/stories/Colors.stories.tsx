import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

interface ColorToken {
  name: string;
  token: string;
  value: string;
  className: string;
}

interface ColorGroup {
  title: string;
  description: string;
  colors: ColorToken[];
}

const PRIMITIVE_GROUPS: ColorGroup[] = [
  {
    title: "Orange",
    description: "브랜드 컬러의 원시 팔레트입니다.",
    colors: [
      {
        name: "Orange 100",
        token: "--color-orange-100",
        value: "#FEEEEA",
        className: "bg-orange-100",
      },
      {
        name: "Orange 200",
        token: "--color-orange-200",
        value: "#FED8D0",
        className: "bg-orange-200",
      },
      {
        name: "Orange 300",
        token: "--color-orange-300",
        value: "#FD947F",
        className: "bg-orange-300",
      },
      {
        name: "Orange 400",
        token: "--color-orange-400",
        value: "#F9502E",
        className: "bg-orange-400",
      },
      {
        name: "Orange 500",
        token: "--color-orange-500",
        value: "#E04829",
        className: "bg-orange-500",
      },
    ],
  },
  {
    title: "Gray",
    description: "아이콘과 보조 텍스트 등에 사용하는 중성 팔레트입니다.",
    colors: [
      { name: "Gray 100", token: "--color-gray-100", value: "#DEDEDE", className: "bg-gray-100" },
      { name: "Gray 200", token: "--color-gray-200", value: "#D9D9D9", className: "bg-gray-200" },
      { name: "Gray 300", token: "--color-gray-300", value: "#C4C4C4", className: "bg-gray-300" },
      { name: "Gray 400", token: "--color-gray-400", value: "#ABABAB", className: "bg-gray-400" },
      { name: "Gray 500", token: "--color-gray-500", value: "#999999", className: "bg-gray-500" },
      { name: "Gray 600", token: "--color-gray-600", value: "#808080", className: "bg-gray-600" },
    ],
  },
  {
    title: "Black",
    description: "본문과 제목에 사용하는 고대비 중성 팔레트입니다.",
    colors: [
      {
        name: "Black 100",
        token: "--color-black-100",
        value: "#61605E",
        className: "bg-black-100",
      },
      {
        name: "Black 200",
        token: "--color-black-200",
        value: "#474643",
        className: "bg-black-200",
      },
      {
        name: "Black 300",
        token: "--color-black-300",
        value: "#302F2D",
        className: "bg-black-300",
      },
      {
        name: "Black 400",
        token: "--color-black-400",
        value: "#262524",
        className: "bg-black-400",
      },
      {
        name: "Black 500",
        token: "--color-black-500",
        value: "#111111",
        className: "bg-black-500",
      },
    ],
  },
  {
    title: "Surface & Status",
    description: "배경, 구분선, 상태 표현의 원시 팔레트입니다.",
    colors: [
      { name: "White", token: "--color-white", value: "#FFFFFF", className: "bg-white" },
      {
        name: "Background 100",
        token: "--color-background-100",
        value: "#FAFAFA",
        className: "bg-background-100",
      },
      {
        name: "Background 200",
        token: "--color-background-200",
        value: "#F7F7F7",
        className: "bg-background-200",
      },
      {
        name: "Background 300",
        token: "--color-background-300",
        value: "#EFEFEF",
        className: "bg-background-300",
      },
      { name: "Line 100", token: "--color-line-100", value: "#F2F2F2", className: "bg-line-100" },
      { name: "Line 200", token: "--color-line-200", value: "#E6E6E6", className: "bg-line-200" },
      { name: "Red 100", token: "--color-red-100", value: "#FFEEF0", className: "bg-red-100" },
      { name: "Red 200", token: "--color-red-200", value: "#FF4F64", className: "bg-red-200" },
      {
        name: "Yellow 100",
        token: "--color-yellow-100",
        value: "#FFC149",
        className: "bg-yellow-100",
      },
    ],
  },
];

const SEMANTIC_GROUPS: ColorGroup[] = [
  {
    title: "Brand",
    description: "브랜드 위계와 상호작용 상태를 표현합니다.",
    colors: [
      {
        name: "Primary strong",
        token: "--color-brand-primary-strong",
        value: "Orange 500",
        className: "bg-brand-primary-strong",
      },
      {
        name: "Primary",
        token: "--color-brand-primary",
        value: "Orange 400",
        className: "bg-brand-primary",
      },
      {
        name: "Primary muted",
        token: "--color-brand-primary-muted",
        value: "Orange 300",
        className: "bg-brand-primary-muted",
      },
      {
        name: "Primary subtle",
        token: "--color-brand-primary-subtle",
        value: "Orange 100",
        className: "bg-brand-primary-subtle",
      },
    ],
  },
  {
    title: "Background",
    description: "페이지와 컴포넌트 표면 및 상태 배경입니다.",
    colors: [
      {
        name: "Default",
        token: "--color-background-default",
        value: "White",
        className: "bg-background-default",
      },
      {
        name: "Surface",
        token: "--color-background-surface",
        value: "White",
        className: "bg-background-surface",
      },
      {
        name: "Muted",
        token: "--color-background-muted",
        value: "Background 200",
        className: "bg-background-muted",
      },
      {
        name: "Subtle",
        token: "--color-background-subtle",
        value: "Background 100",
        className: "bg-background-subtle",
      },
      {
        name: "Hover",
        token: "--color-background-hover",
        value: "Background 300",
        className: "bg-background-hover",
      },
      {
        name: "Disabled",
        token: "--color-background-disabled",
        value: "Gray 200",
        className: "bg-background-disabled",
      },
      {
        name: "Brand",
        token: "--color-background-brand",
        value: "Brand primary",
        className: "bg-background-brand",
      },
      {
        name: "Brand hover",
        token: "--color-background-brand-hover",
        value: "Brand primary strong",
        className: "bg-background-brand-hover",
      },
      {
        name: "Brand muted",
        token: "--color-background-brand-muted",
        value: "Brand primary subtle",
        className: "bg-background-brand-muted",
      },
      {
        name: "Avatar",
        token: "--color-background-avatar",
        value: "Black 300",
        className: "bg-background-avatar",
      },
    ],
  },
  {
    title: "Text",
    description: "텍스트의 중요도, 상태, 배경 대비에 따라 사용합니다.",
    colors: [
      {
        name: "Primary",
        token: "--color-text-primary",
        value: "Black 500",
        className: "bg-text-primary",
      },
      {
        name: "Secondary",
        token: "--color-text-secondary",
        value: "Black 400",
        className: "bg-text-secondary",
      },
      {
        name: "Tertiary",
        token: "--color-text-tertiary",
        value: "Black 300",
        className: "bg-text-tertiary",
      },
      {
        name: "Description",
        token: "--color-text-description",
        value: "Black 200",
        className: "bg-text-description",
      },
      { name: "Muted", token: "--color-text-muted", value: "Gray 600", className: "bg-text-muted" },
      {
        name: "Subtle",
        token: "--color-text-subtle",
        value: "Gray 500",
        className: "bg-text-subtle",
      },
      { name: "Weak", token: "--color-text-weak", value: "Gray 400", className: "bg-text-weak" },
      {
        name: "Placeholder",
        token: "--color-text-placeholder",
        value: "Gray 500",
        className: "bg-text-placeholder",
      },
      {
        name: "Disabled",
        token: "--color-text-disabled",
        value: "Gray 600",
        className: "bg-text-disabled",
      },
      {
        name: "Brand",
        token: "--color-text-brand",
        value: "Brand primary",
        className: "bg-text-brand",
      },
      {
        name: "Inverse",
        token: "--color-text-inverse",
        value: "White",
        className: "bg-text-inverse",
      },
      {
        name: "Error",
        token: "--color-text-error",
        value: "Status error",
        className: "bg-text-error",
      },
    ],
  },
  {
    title: "Border",
    description: "경계선의 위계와 입력 상태를 표현합니다.",
    colors: [
      {
        name: "Default",
        token: "--color-border-default",
        value: "Line 200",
        className: "bg-border-default",
      },
      {
        name: "Muted",
        token: "--color-border-muted",
        value: "Gray 200",
        className: "bg-border-muted",
      },
      {
        name: "Subtle",
        token: "--color-border-subtle",
        value: "Line 100",
        className: "bg-border-subtle",
      },
      {
        name: "Brand",
        token: "--color-border-brand",
        value: "Brand primary",
        className: "bg-border-brand",
      },
      {
        name: "Error",
        token: "--color-border-error",
        value: "Status error",
        className: "bg-border-error",
      },
      {
        name: "Disabled",
        token: "--color-border-disabled",
        value: "Gray 300",
        className: "bg-border-disabled",
      },
      {
        name: "Dimmed",
        token: "--color-border-dimmed",
        value: "Gray 400",
        className: "bg-border-dimmed",
      },
    ],
  },
  {
    title: "Icon",
    description: "아이콘의 위계와 브랜드 강조 단계입니다.",
    colors: [
      {
        name: "Strong",
        token: "--color-icon-strong",
        value: "Black 100",
        className: "bg-icon-strong",
      },
      {
        name: "Default",
        token: "--color-icon-default",
        value: "Gray 400",
        className: "bg-icon-default",
      },
      { name: "Muted", token: "--color-icon-muted", value: "Gray 300", className: "bg-icon-muted" },
      {
        name: "Subtle",
        token: "--color-icon-subtle",
        value: "Gray 200",
        className: "bg-icon-subtle",
      },
      { name: "Weak", token: "--color-icon-weak", value: "Gray 100", className: "bg-icon-weak" },
      {
        name: "Brand",
        token: "--color-icon-brand",
        value: "Brand primary",
        className: "bg-icon-brand",
      },
      {
        name: "Brand secondary",
        token: "--color-icon-brand-secondary",
        value: "Brand primary muted",
        className: "bg-icon-brand-secondary",
      },
      {
        name: "Brand tertiary",
        token: "--color-icon-brand-tertiary",
        value: "Brand primary subtle",
        className: "bg-icon-brand-tertiary",
      },
      {
        name: "Inverse",
        token: "--color-icon-inverse",
        value: "White",
        className: "bg-icon-inverse",
      },
      {
        name: "Arrow right",
        token: "--color-icon-arrow-right-fill",
        value: "Black 300",
        className: "bg-icon-arrow-right-fill",
      },
    ],
  },
];

const COMPONENT_GROUPS: ColorGroup[] = [
  {
    title: "Feedback & Rating",
    description: "오류, 별점, 토스트 등 사용자 피드백에 사용합니다.",
    colors: [
      {
        name: "Status error",
        token: "--color-status-error",
        value: "Red 200",
        className: "bg-status-error",
      },
      {
        name: "Rating fill",
        token: "--color-rating-fill",
        value: "Yellow 100",
        className: "bg-rating-fill",
      },
      {
        name: "Rating count",
        token: "--color-rating-count",
        value: "Gray 400",
        className: "bg-rating-count",
      },
      {
        name: "Rating track",
        token: "--color-rating-track",
        value: "Background 300",
        className: "bg-rating-track",
      },
      {
        name: "Rating empty",
        token: "--color-rating-empty",
        value: "Gray 200",
        className: "bg-rating-empty",
      },
      {
        name: "Toast background",
        token: "--color-toast-background",
        value: "Orange 200",
        className: "bg-toast-background",
      },
      {
        name: "Toast text",
        token: "--color-toast-text",
        value: "Orange 400",
        className: "bg-toast-text",
      },
    ],
  },
  {
    title: "Overlay & State",
    description: "오버레이 및 선택 상태를 표현하는 컴포넌트 토큰입니다.",
    colors: [
      {
        name: "Overlay scrim",
        token: "--color-overlay-scrim",
        value: "rgba(20, 20, 20, 0.5)",
        className: "bg-overlay-scrim",
      },
      {
        name: "Card disabled",
        token: "--color-overlay-card-disabled",
        value: "rgba(4, 4, 4, 0.64)",
        className: "bg-overlay-card-disabled",
      },
      {
        name: "Like default",
        token: "--color-like-default-stroke",
        value: "Gray 100",
        className: "bg-like-default-stroke",
      },
      {
        name: "Like active",
        token: "--color-like-active-fill",
        value: "Red 200",
        className: "bg-like-active-fill",
      },
      {
        name: "Scrollbar thumb",
        token: "--color-scrollbar-thumb",
        value: "Gray 400",
        className: "bg-scrollbar-thumb",
      },
      {
        name: "Date disabled",
        token: "--color-date-disabled",
        value: "Gray 200",
        className: "bg-date-disabled",
      },
      {
        name: "Notice background",
        token: "--color-notice-background",
        value: "Background 200",
        className: "bg-notice-background",
      },
      {
        name: "Notice text",
        token: "--color-notice-text",
        value: "Black 100",
        className: "bg-notice-text",
      },
    ],
  },
  {
    title: "Social",
    description: "소셜 로그인 제공자별 고유 컬러입니다.",
    colors: [
      {
        name: "Kakao background",
        token: "--color-social-kakao-background",
        value: "#FAE100",
        className: "bg-social-kakao-background",
      },
      {
        name: "Kakao icon",
        token: "--color-social-kakao-icon",
        value: "#331D1E",
        className: "bg-social-kakao-icon",
      },
      {
        name: "Naver background",
        token: "--color-social-naver-background",
        value: "#03C75A",
        className: "bg-social-naver-background",
      },
      {
        name: "Naver icon",
        token: "--color-social-naver-icon",
        value: "White",
        className: "bg-social-naver-icon",
      },
      {
        name: "Google background",
        token: "--color-social-google-background",
        value: "Line 100",
        className: "bg-social-google-background",
      },
      {
        name: "Facebook background",
        token: "--color-social-facebook-background",
        value: "#1877F2",
        className: "bg-social-facebook-background",
      },
      {
        name: "Facebook icon",
        token: "--color-social-facebook-icon",
        value: "White",
        className: "bg-social-facebook-icon",
      },
    ],
  },
  {
    title: "Navigation & Filter",
    description: "내비게이션과 필터처럼 특정 컴포넌트에 한정된 토큰입니다.",
    colors: [
      {
        name: "Nav text active",
        token: "--color-nav-text-active",
        value: "Black 500",
        className: "bg-nav-text-active",
      },
      {
        name: "Nav text default",
        token: "--color-nav-text-default",
        value: "Gray 500",
        className: "bg-nav-text-default",
      },
      {
        name: "Nav indicator",
        token: "--color-nav-indicator-active",
        value: "Black 400",
        className: "bg-nav-indicator-active",
      },
      {
        name: "Filter icon",
        token: "--color-filter-button-icon",
        value: "Gray 600",
        className: "bg-filter-button-icon",
      },
      {
        name: "Filter border",
        token: "--color-filter-button-border",
        value: "Gray 600",
        className: "bg-filter-button-border",
      },
      {
        name: "Landing hero warm",
        token: "--color-landing-hero-warm",
        value: "#462B14",
        className: "bg-landing-hero-warm",
      },
    ],
  },
];

const ColorCard = ({ color }: { color: ColorToken }) => (
  <div className="border-border-subtle rounded-12 bg-background-surface overflow-hidden border">
    <div className="bg-background-muted p-8">
      <div className={cn("border-border-subtle rounded-8 h-72 w-full border", color.className)} />
    </div>
    <div className="flex flex-col gap-2 p-12">
      <Text variant="md-semibold" className="text-text-primary">
        {color.name}
      </Text>
      <Text variant="xs-regular" className="text-text-muted break-all">
        {color.token}
      </Text>
      <Text variant="xs-regular" className="text-text-subtle">
        {color.value}
      </Text>
    </div>
  </div>
);

const ColorPalette = ({ groups }: { groups: ColorGroup[] }) => (
  <div className="flex w-full max-w-[1200px] flex-col gap-48">
    {groups.map((group) => (
      <section key={group.title} className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <Text as="h2" variant="2xl-bold" className="text-text-primary">
            {group.title}
          </Text>
          <Text variant="md-regular" className="text-text-muted">
            {group.description}
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-16 md:grid-cols-3 xl:grid-cols-5">
          {group.colors.map((color) => (
            <ColorCard key={color.token} color={color} />
          ))}
        </div>
      </section>
    ))}
  </div>
);

const meta = {
  title: "Foundations/Colors",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primitives: Story = {
  render: () => <ColorPalette groups={PRIMITIVE_GROUPS} />,
};

export const Semantic: Story = {
  render: () => <ColorPalette groups={SEMANTIC_GROUPS} />,
};

export const ComponentTokens: Story = {
  render: () => <ColorPalette groups={COMPONENT_GROUPS} />,
};
