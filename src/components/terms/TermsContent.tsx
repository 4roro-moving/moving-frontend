import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils/cn";

interface TermsContentProps {
  /** 약관 본문 (Markdown) */
  content: string;
  className?: string;
}

/**
 * 약관 본문 렌더러.
 *
 * 관리자 작성 화면의 미리보기와 이 컴포넌트가 같은 결과를 내야 하므로,
 * 스타일을 바꿀 때는 관리자 쪽도 함께 확인해 주세요.
 *
 * `react-markdown`은 raw HTML을 렌더링하지 않아 XSS에 안전합니다.
 * `rehype-raw` 등을 붙이면 이 전제가 깨지므로 도입 전 검토가 필요합니다.
 */
const TermsContent = ({ content, className }: TermsContentProps) => (
  <div
    className={cn(
      "text-text-secondary text-[length:var(--font-size-14)] leading-[var(--line-height-24)]",
      // 조 제목
      "[&_h2]:text-text-primary [&_h2]:mt-32 [&_h2]:mb-12 [&_h2]:text-[length:var(--font-size-18)] [&_h2]:leading-[var(--line-height-26)] [&_h2]:font-bold [&_h2]:first:mt-0",
      "[&_h3]:text-text-primary [&_h3]:mt-24 [&_h3]:mb-8 [&_h3]:text-[length:var(--font-size-16)] [&_h3]:leading-[var(--line-height-26)] [&_h3]:font-semibold",
      // 문단
      "[&_p]:mb-12 [&_p]:last:mb-0",
      // 항 목록
      "[&_ol]:mb-12 [&_ol]:list-decimal [&_ol]:pl-20",
      "[&_ul]:mb-12 [&_ul]:list-disc [&_ul]:pl-20",
      "[&_li]:mb-4",
      // 강조와 링크
      "[&_strong]:text-text-primary [&_strong]:font-semibold",
      "[&_a]:text-text-brand [&_a]:underline [&_a]:underline-offset-2",
      // 구분선과 인용
      "[&_hr]:border-border-default [&_hr]:my-24",
      "[&_blockquote]:border-border-brand [&_blockquote]:text-text-muted [&_blockquote]:my-12 [&_blockquote]:border-l-2 [&_blockquote]:pl-16",
      // 표
      "[&_table]:mb-12 [&_table]:w-full [&_table]:border-collapse",
      "[&_th]:border-border-default [&_th]:bg-background-subtle [&_th]:text-text-primary [&_th]:border [&_th]:px-12 [&_th]:py-8 [&_th]:text-left [&_th]:font-semibold",
      "[&_td]:border-border-default [&_td]:border [&_td]:px-12 [&_td]:py-8",
      className,
    )}
  >
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);

export default TermsContent;
