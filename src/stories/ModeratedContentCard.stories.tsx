import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ModeratedContentCard from "@/components/my-content/ModeratedContentCard";
import { Text } from "@/components/common/Text";
import type { MyContentDetail } from "@/types/myContent";

const hiddenResidenceReview: MyContentDetail = {
  contentType: "RESIDENCE_REVIEW",
  id: 203,
  isHidden: true,
  authorName: "이하늘",
  createdAt: "2026-08-10T19:40:00.000Z",
  rating: 2,
  title: "소음 심한 원룸",
  body: "야간 소음이 심하고 관리실 응대가 불친절합니다. 비추천합니다.",
  meta: "경기 성남시",
  latestModeration: {
    action: "HIDE",
    reason: "개인 비방 및 과도한 비난 표현 포함",
    adminName: "관리자",
    createdAt: "2026-08-12T14:30:00.000Z",
  },
};

const hiddenReview: MyContentDetail = {
  contentType: "REVIEW",
  id: 11,
  isHidden: true,
  authorName: "김나영",
  createdAt: "2026-08-18T10:20:00.000Z",
  rating: 5,
  title: null,
  body: "이사 당일 일정이 정확했고 포장도 꼼꼼했습니다.",
  meta: "기사님 홍길동",
  latestModeration: {
    action: "HIDE",
    reason: "개인정보(연락처) 포함으로 숨김 처리했습니다.",
    adminName: "관리자",
    createdAt: "2026-08-19T09:00:00.000Z",
  },
};

const hiddenGiveaway: MyContentDetail = {
  contentType: "GIVEAWAY",
  id: 7,
  isHidden: true,
  authorName: "박서준",
  createdAt: "2026-08-15T08:05:00.000Z",
  rating: null,
  title: "책장 나눔합니다",
  body: "이사 후 남는 책장입니다. 직접 가져가실 분만 신청해 주세요.",
  meta: "서울 마포구",
  latestModeration: {
    action: "HIDE",
    reason: "거래 유도 및 외부 연락처 유도 문구 포함",
    adminName: "관리자",
    createdAt: "2026-08-16T11:20:00.000Z",
  },
};

function ModeratedContentPreview({ title, content }: { title: string; content: MyContentDetail }) {
  return (
    <section className="px-margin-mobile md:px-margin-tablet mx-auto flex w-full max-w-[720px] flex-col items-center gap-24 py-40 md:py-64 xl:px-0">
      <header className="flex w-full flex-col items-center gap-8 text-center">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          {title}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          관리자 처리 결과와 사유를 확인할 수 있습니다.
        </Text>
      </header>
      <div className="w-full">
        <ModeratedContentCard content={content} />
      </div>
    </section>
  );
}

const meta = {
  title: "MyContent/ModeratedContentCard",
  component: ModeratedContentCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "콘텐츠 숨김 알림 클릭 후 작성자가 보는 읽기 전용 카드입니다. 로그인 없이 UI만 확인할 때 이 스토리를 사용하세요.",
      },
    },
  },
} satisfies Meta<typeof ModeratedContentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResidenceReviewHidden: Story = {
  name: "거주후기 숨김 (페이지 레이아웃)",
  args: { content: hiddenResidenceReview },
  render: () => (
    <ModeratedContentPreview title="숨김 처리된 거주후기" content={hiddenResidenceReview} />
  ),
};

export const ReviewHidden: Story = {
  name: "리뷰 숨김 (페이지 레이아웃)",
  args: { content: hiddenReview },
  render: () => <ModeratedContentPreview title="숨김 처리된 리뷰" content={hiddenReview} />,
};

export const GiveawayHidden: Story = {
  name: "나눔 숨김 (페이지 레이아웃)",
  args: { content: hiddenGiveaway },
  render: () => <ModeratedContentPreview title="숨김 처리된 나눔게시물" content={hiddenGiveaway} />,
};
