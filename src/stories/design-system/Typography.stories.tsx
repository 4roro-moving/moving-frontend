import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  SEMANTIC_TEXT_VARIANTS,
  Text,
  type SemanticTextVariant,
  type TextVariant,
} from "@/components/common/Text";

interface TypographyStyle {
  variant: TextVariant;
  figmaName: string;
  size: number;
  lineHeight: number;
  weight: number;
}

const TEXT_STYLES: TypographyStyle[] = [
  { variant: "xs-regular", figmaName: "Text/Xs/Regular", size: 12, lineHeight: 18, weight: 400 },
  { variant: "xs-medium", figmaName: "Text/Xs/Medium", size: 12, lineHeight: 18, weight: 500 },
  { variant: "xs-semibold", figmaName: "Text/Xs/Semibold", size: 12, lineHeight: 18, weight: 600 },
  { variant: "sm-medium", figmaName: "Text/Sm/Medium", size: 13, lineHeight: 22, weight: 500 },
  { variant: "sm-semibold", figmaName: "Text/Sm/Semibold", size: 13, lineHeight: 22, weight: 600 },
  { variant: "md-regular", figmaName: "Text/Md/Regular", size: 14, lineHeight: 24, weight: 400 },
  { variant: "md-medium", figmaName: "Text/Md/Medium", size: 14, lineHeight: 24, weight: 500 },
  { variant: "md-semibold", figmaName: "Text/Md/Semibold", size: 14, lineHeight: 24, weight: 600 },
  { variant: "md-bold", figmaName: "Text/Md/Bold", size: 14, lineHeight: 24, weight: 700 },
  { variant: "lg-regular", figmaName: "Text/Lg/Regular", size: 16, lineHeight: 26, weight: 400 },
  { variant: "lg-medium", figmaName: "Text/Lg/Medium", size: 16, lineHeight: 26, weight: 500 },
  { variant: "lg-semibold", figmaName: "Text/Lg/Semibold", size: 16, lineHeight: 26, weight: 600 },
  { variant: "lg-bold", figmaName: "Text/Lg/Bold", size: 16, lineHeight: 26, weight: 700 },
  { variant: "2lg-regular", figmaName: "Text/2lg/Regular", size: 18, lineHeight: 26, weight: 400 },
  { variant: "2lg-medium", figmaName: "Text/2lg/Medium", size: 18, lineHeight: 26, weight: 500 },
  {
    variant: "2lg-semibold",
    figmaName: "Text/2lg/Semibold",
    size: 18,
    lineHeight: 26,
    weight: 600,
  },
  { variant: "2lg-bold", figmaName: "Text/2lg/Bold", size: 18, lineHeight: 26, weight: 700 },
  { variant: "xl-regular", figmaName: "Text/Xl/Regular", size: 20, lineHeight: 32, weight: 400 },
  { variant: "xl-medium", figmaName: "Text/Xl/Medium", size: 20, lineHeight: 32, weight: 500 },
  { variant: "xl-semibold", figmaName: "Text/Xl/Semibold", size: 20, lineHeight: 32, weight: 600 },
  { variant: "xl-bold", figmaName: "Text/Xl/Bold", size: 20, lineHeight: 32, weight: 700 },
  { variant: "2xl-regular", figmaName: "Text/2xl/Regular", size: 24, lineHeight: 32, weight: 400 },
  { variant: "2xl-medium", figmaName: "Text/2xl/Medium", size: 24, lineHeight: 32, weight: 500 },
  {
    variant: "2xl-semibold",
    figmaName: "Text/2xl/Semibold",
    size: 24,
    lineHeight: 32,
    weight: 600,
  },
  { variant: "2xl-bold", figmaName: "Text/2xl/Bold", size: 24, lineHeight: 32, weight: 700 },
  {
    variant: "3xl-semibold",
    figmaName: "Text/3xl/Semibold",
    size: 32,
    lineHeight: 46,
    weight: 600,
  },
  { variant: "3xl-bold", figmaName: "Text/3xl/Bold", size: 32, lineHeight: 46, weight: 700 },
];

const SPECIAL_STYLES: TypographyStyle[] = [
  { variant: "link-xs", figmaName: "Link/Xs", size: 12, lineHeight: 18, weight: 600 },
  { variant: "link-xl", figmaName: "Link/Xl", size: 20, lineHeight: 32, weight: 600 },
  { variant: "rating-score", figmaName: "Rating/Score", size: 40, lineHeight: 48, weight: 500 },
];

const SEMANTIC_VARIANTS = Object.keys(SEMANTIC_TEXT_VARIANTS) as SemanticTextVariant[];
const VARIANT_OPTIONS = [...TEXT_STYLES, ...SPECIAL_STYLES].map(({ variant }) => variant);

const TYPOGRAPHY_DESCRIPTION =
  "텍스트는 크기·굵기 유틸리티를 직접 조합하지 않고 `Text` 컴포넌트로 작성합니다. `variant`로 글꼴 스타일을, `as`로 HTML 의미를 지정하고 색상·배치는 `className`으로 추가합니다.";

const PLAYGROUND_SOURCE = `<Text as="span" variant="md-regular" className="text-text-primary">
  무빙 디자인 시스템 Typography
</Text>`;

const RESPONSIVE_SOURCE = `<Text
  as="h1"
  variant={{ base: "2lg-semibold", xl: "2xl-semibold" }}
  className="text-text-primary"
>
  기사님 찾기
</Text>`;

const SEMANTIC_SOURCE = `<div className="flex flex-col gap-24">
  <Text as="h1" variant="pageTitle" className="text-text-primary">
    페이지 제목
  </Text>

  <div className="flex flex-col gap-8">
    <Text
      as="label"
      htmlFor="semantic-field"
      variant="fieldLabel"
      className="text-text-tertiary"
    >
      폼 필드 라벨
    </Text>
    <input
      id="semantic-field"
      type="text"
      className="rounded-8 border border-border-default px-12 py-8"
    />
  </div>

  <Text as="h2" variant="modalTitle" className="text-text-primary">
    모달 제목
  </Text>
</div>
`;

const meta = {
  title: "Foundations/Typography",
  component: Text,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: { description: { component: TYPOGRAPHY_DESCRIPTION } },
  },
  args: {
    as: "span",
    variant: "md-regular",
    children: "무빙 디자인 시스템 Typography",
    className: "text-text-primary",
  },
  argTypes: {
    as: {
      control: "select",
      options: ["span", "p", "label", "h1", "h2", "h3", "strong"],
      description: "텍스트의 의미에 맞는 HTML 태그",
      table: { type: { summary: "ElementType" }, defaultValue: { summary: "span" } },
    },
    variant: {
      control: "select",
      options: [...VARIANT_OPTIONS, ...SEMANTIC_VARIANTS],
      description: "타이포그래피 스타일",
      table: {
        type: { summary: "TextVariant | ResponsiveTextVariant | SemanticTextVariant" },
        defaultValue: { summary: "md-regular" },
      },
    },
    children: {
      control: "text",
      description: "Text 내부에 표시할 콘텐츠",
      table: { type: { summary: "ReactNode" } },
    },
    className: {
      control: "text",
      description: "색상과 레이아웃 등 타이포그래피 외 스타일",
      table: { type: { summary: "string" } },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

function TypographyRows({ styles }: { styles: TypographyStyle[] }) {
  return (
    <div className="flex flex-col gap-16">
      {styles.map(({ variant, figmaName, size, lineHeight, weight }) => (
        <div
          key={variant}
          className="border-border-subtle grid gap-8 border-b pb-12 md:grid-cols-[180px_1fr_160px] md:items-center"
        >
          <div className="flex flex-col gap-2">
            <Text variant="xs-semibold" className="text-text-secondary">
              {variant}
            </Text>
            <Text variant="xs-regular" className="text-text-muted">
              {figmaName}
            </Text>
          </div>
          <Text variant={variant} className="text-text-primary">
            무빙 디자인 시스템 Typography
          </Text>
          <Text variant="xs-regular" className="text-text-muted">
            {size}px / {lineHeight}px / {weight}
          </Text>
        </div>
      ))}
    </div>
  );
}

export const Playground: Story = {
  parameters: {
    docs: {
      source: { code: PLAYGROUND_SOURCE, language: "tsx" },
    },
  },
};

export const AtomicVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "Figma Text Style과 일대일로 대응하는 기본 variant입니다.",
      },
    },
  },
  render: () => <TypographyRows styles={TEXT_STYLES} />,
};

export const SpecialVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "기본 조합으로 표현하기 어려운 링크·평점 전용 스타일입니다.",
      },
    },
  },
  render: () => <TypographyRows styles={SPECIAL_STYLES} />,
};

export const SemanticVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: "역할별로 정의된 반응형 조합입니다. 너비를 바꿔 breakpoint별 차이를 확인하세요.",
      },
      source: { code: SEMANTIC_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <div className="flex flex-col gap-24">
      <Text as="h1" variant="pageTitle" className="text-text-primary">
        페이지 제목
      </Text>

      <div className="flex flex-col gap-8">
        <Text
          as="label"
          htmlFor="semantic-field"
          variant="fieldLabel"
          className="text-text-tertiary"
        >
          폼 필드 라벨
        </Text>

        <input
          id="semantic-field"
          type="text"
          className="rounded-8 border-border-default border px-12 py-8"
        />
      </div>

      <Text as="h2" variant="modalTitle" className="text-text-primary">
        모달 제목
      </Text>
    </div>
  ),
};

export const ResponsiveObject: Story = {
  parameters: {
    docs: {
      description: {
        story: "일회성 반응형 조합은 `{ base, md?, xl? }` 객체로 지정합니다.",
      },
      source: { code: RESPONSIVE_SOURCE, language: "tsx" },
    },
  },
  render: () => (
    <Text
      as="h1"
      variant={{ base: "2lg-semibold", xl: "2xl-semibold" }}
      className="text-text-primary"
    >
      기사님 찾기
    </Text>
  ),
};
