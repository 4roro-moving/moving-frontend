import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ComponentType, SVGProps } from "react";

import { Text } from "@/components/common/Text";
import {
  AlarmIcon,
  ArrowRightIcon,
  BoxIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronLeftThinIcon,
  ChevronRightIcon,
  ChevronRightThinIcon,
  ChevronUpIcon,
  ClearIcon,
  ClipIcon,
  CloseIcon,
  CompanyIcon,
  ConfirmedCheckIcon,
  DocumentIcon,
  DriverBadgeIcon,
  GoogleIcon,
  HomeIcon,
  InfoIcon,
  KakaoLoginIcon,
  LikeIcon,
  MenuIcon,
  NaverLoginIcon,
  ProfileDefaultIcon,
  SearchIcon,
  StarIcon,
  VisibilityIcon,
  VisibilityOffIcon,
  WriteIcon,
} from "@/icons";

interface IconEntry {
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const ICONS: IconEntry[] = [
  { name: "Alarm", Icon: AlarmIcon },
  { name: "Box", Icon: BoxIcon },
  { name: "Calendar", Icon: CalendarIcon },
  { name: "ConfirmedCheck", Icon: ConfirmedCheckIcon },
  { name: "ChevronDown", Icon: ChevronDownIcon },
  { name: "ChevronLeft", Icon: ChevronLeftIcon },
  { name: "ChevronLeftThin", Icon: ChevronLeftThinIcon },
  { name: "ChevronRight", Icon: ChevronRightIcon },
  { name: "ChevronRightThin", Icon: ChevronRightThinIcon },
  { name: "ChevronUp", Icon: ChevronUpIcon },
  { name: "Clip", Icon: ClipIcon },
  { name: "Close", Icon: CloseIcon },
  { name: "Document", Icon: DocumentIcon },
  { name: "Info", Icon: InfoIcon },
  { name: "Like", Icon: LikeIcon },
  { name: "Menu", Icon: MenuIcon },
  { name: "Search", Icon: SearchIcon },
  { name: "Star", Icon: StarIcon },
  { name: "Visibility", Icon: VisibilityIcon },
  { name: "VisibilityOff", Icon: VisibilityOffIcon },
  { name: "Write", Icon: WriteIcon },
];

const COLOR_ICONS: IconEntry[] = [
  { name: "Clear", Icon: ClearIcon },
  { name: "ProfileDefault", Icon: ProfileDefaultIcon },
  { name: "Home", Icon: HomeIcon },
  { name: "Company", Icon: CompanyIcon },
  { name: "DriverBadge", Icon: DriverBadgeIcon },
  { name: "Google", Icon: GoogleIcon },
  { name: "KakaoLogin", Icon: KakaoLoginIcon },
  { name: "NaverLogin", Icon: NaverLoginIcon },
];

const ICON_DESCRIPTION = `아이콘 분류와 사용 규칙입니다.

| 위치 | 용도 | 색상 처리 |
| --- | --- | --- |
| \`src/icons\` | 단색 UI 아이콘 (상태별 색상 변경) | \`currentColor\` |
| \`src/icons/color\` | 브랜드 고정색 다색 아이콘 | SVG 원본 유지 |
| \`public/icons\` | 컴포넌트화 불필요한 정적 아이콘 | 원본 유지 |
| \`public/images\` | 일러스트·이미지 | 원본 유지 |

- 단색 아이콘은 \`text-icon-*\` 토큰으로 색상 제어, 다색 아이콘은 크기·배치만 조정합니다.
- 공통 아이콘은 \`@/icons\`에서 named import 합니다.
- 아이콘 전용 버튼·링크에는 부모에 \`aria-label\`을 제공합니다 (SVG 자체는 \`aria-hidden\`이 이미 적용되어 있음).
- 새 단색 아이콘 추가 시 fill/stroke를 \`currentColor\`로 작성합니다.`;

const MONOCHROME_SOURCE = `import { CloseIcon } from "@/icons";

<button type="button" className="group" aria-label="닫기">
  <CloseIcon className="text-icon-default group-hover:text-icon-strong size-24" />
</button>`;

const MULTICOLOR_SOURCE = `import { CompanyIcon, HomeIcon } from "@/icons";

<div className="flex items-center gap-12">
  <HomeIcon className="size-20" />
  <CompanyIcon className="size-20" />
</div>`;

const meta = {
  title: "Foundations/Icons",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: ICON_DESCRIPTION } },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  parameters: {
    docs: {
      description: { story: "`src/icons`의 단색 UI 아이콘입니다." },
    },
  },
  render: () => (
    <div className="grid w-full max-w-[960px] grid-cols-3 gap-12 md:grid-cols-5 xl:grid-cols-7">
      {ICONS.map(({ name, Icon }) => (
        <div
          key={name}
          className="border-border-subtle rounded-12 flex min-h-72 flex-col items-center justify-center gap-8 border p-12"
        >
          <Icon className="text-icon-default size-24" />
          <Text variant="xs-medium" className="text-text-muted text-center">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const MonochromeStates: Story = {
  parameters: {
    docs: {
      description: { story: "`text-icon-*` 토큰으로 표현하는 상태별 색상입니다." },
      source: { code: MONOCHROME_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="flex flex-wrap items-center gap-32">
      {[
        { name: "Default", className: "text-icon-default" },
        { name: "Strong", className: "text-icon-strong" },
        { name: "Brand", className: "text-icon-brand" },
        { name: "Disabled", className: "text-icon-muted" },
      ].map(({ name, className }) => (
        <div key={name} className="flex flex-col items-center gap-8">
          <CloseIcon className={`${className} size-24`} />
          <Text variant="xs-medium" className="text-text-muted">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const LikeStates: Story = {
  parameters: {
    docs: {
      description: { story: "LikeIcon은 `isFavorite`으로 찜 전·후 상태를 표시합니다." },
      source: {
        code: `import { LikeIcon } from "@/icons";

<LikeIcon className="text-like-default-stroke size-24" />
<LikeIcon isFavorite className="text-like-active-fill size-24" />`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-32">
      <div className="flex flex-col items-center gap-8">
        <LikeIcon className="text-like-default-stroke size-24" />
        <Text variant="xs-medium" className="text-text-muted">
          Default
        </Text>
      </div>
      <div className="flex flex-col items-center gap-8">
        <LikeIcon isFavorite className="text-like-active-fill size-24" />
        <Text variant="xs-medium" className="text-text-muted">
          Favorite
        </Text>
      </div>
    </div>
  ),
};

export const Multicolor: Story = {
  parameters: {
    docs: {
      description: {
        story: "`src/icons/color`의 다색 아이콘입니다. className은 크기·배치에만 사용합니다.",
      },
      source: { code: MULTICOLOR_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="grid w-full max-w-[720px] grid-cols-2 gap-12 md:grid-cols-3">
      {COLOR_ICONS.map(({ name, Icon }) => (
        <div
          key={name}
          className="border-border-subtle rounded-12 flex min-h-80 flex-col items-center justify-center gap-8 border p-12"
        >
          <Icon className="size-32" />
          <Text variant="xs-medium" className="text-text-muted text-center">
            {name}
          </Text>
        </div>
      ))}
    </div>
  ),
};

export const ArrowRightSizes: Story = {
  parameters: {
    docs: {
      description: { story: "8·12·16px 중 size prop으로 선택합니다." },
      source: {
        code: `import { ArrowRightIcon } from "@/icons";

<ArrowRightIcon size={8} />
<ArrowRightIcon size={12} />
<ArrowRightIcon size={16} />`,
        language: "tsx",
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-32">
      {([8, 12, 16] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-8">
          <ArrowRightIcon size={size} />
          <Text variant="xs-medium" className="text-text-muted">
            {size}px
          </Text>
        </div>
      ))}
    </div>
  ),
};
