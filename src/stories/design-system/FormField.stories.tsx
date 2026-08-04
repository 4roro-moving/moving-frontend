import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import Textarea from "@/components/common/Input/Textarea";
import { Text } from "@/components/common/Text";

const FORM_FIELD_SOURCE = `<FormField label="이름" labelFor="name" variant="default">
  <Input id="name" placeholder="이름을 입력해 주세요" />
</FormField>`;

const meta = {
  title: "UI/FormField",
  component: FormField,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "라벨과 입력 요소를 연결하고 일관된 타이포그래피와 간격을 제공하는 컴포넌트입니다. 페이지에서 사용하는 폼은 `default`, 모달처럼 좁은 공간은 `compact`, 로그인·회원가입은 `auth`를 사용합니다.",
      },
    },
  },
  args: {
    label: "라벨",
    labelFor: "storybook-field",
    children: <Input id="storybook-field" placeholder="내용을 입력해 주세요" />,
  },
  argTypes: {
    label: { control: "text", description: "입력 요소 위에 표시할 라벨" },
    labelFor: { control: "text", description: "라벨과 연결할 입력 요소의 id" },
    variant: {
      control: "inline-radio",
      options: ["default", "compact", "auth"],
      description: "폼이 배치되는 화면과 정보 밀도에 따른 스타일",
      table: {
        type: { summary: "default | compact | auth" },
        defaultValue: { summary: "default" },
      },
    },
    labelVariant: { control: false, description: "variant의 기본 라벨 타이포그래피를 재정의" },
    children: { control: false, description: "Input, Textarea 등 라벨과 연결할 입력 요소" },
    className: { control: "text", description: "라벨과 입력 요소 사이 간격 등을 확장하는 클래스" },
  },
  decorators: [
    (Story) => (
      <div className="w-[min(560px,calc(100vw-48px))]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: { docs: { source: { code: FORM_FIELD_SOURCE, language: "tsx" } } },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <section className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            default
          </Text>
          <Text variant="sm-medium" className="text-text-muted">
            프로필 등록·수정처럼 넓은 페이지에서 사용하는 기본 크기
          </Text>
        </div>
        <FormField label="이름" labelFor="default-field" variant="default">
          <Input id="default-field" placeholder="이름을 입력해 주세요" />
        </FormField>
      </section>

      <section className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            compact
          </Text>
          <Text variant="sm-medium" className="text-text-muted">
            모달처럼 제한된 공간에서 사용하는 작은 크기
          </Text>
        </div>
        <FormField label="코멘트" labelFor="compact-field" variant="compact">
          <Textarea
            id="compact-field"
            className="h-[160px]"
            placeholder="상세 내용을 입력해 주세요"
          />
        </FormField>
      </section>

      <section className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            auth
          </Text>
          <Text variant="sm-medium" className="text-text-muted">
            로그인·회원가입 화면에서 사용하는 인증 입력 스타일
          </Text>
        </div>
        <FormField label="이메일" labelFor="auth-field" variant="auth">
          <Input id="auth-field" type="email" placeholder="이메일을 입력해 주세요" />
        </FormField>
      </section>
    </div>
  ),
};
