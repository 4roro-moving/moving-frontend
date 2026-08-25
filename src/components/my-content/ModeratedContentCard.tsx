import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/lib/utils/cn";
import type { MyContentDetail } from "@/types/myContent";

interface ModeratedContentCardProps {
  content: MyContentDetail;
}

function renderStars(rating: number): string {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return `${"★".repeat(clamped)}${"☆".repeat(5 - clamped)}`;
}

/**
 * 관리자 콘텐츠 카드(숨김 사유 포함)를 읽기 전용으로 옮긴 카드.
 * 숨김/복구 버튼은 없음 — 알림 클릭 후 작성자 확인용.
 */
export default function ModeratedContentCard({ content }: ModeratedContentCardProps) {
  const t = useTranslations("myContent");
  const format = useFormatter();
  const isHidden = content.isHidden;
  const createdAt = new Date(content.createdAt);
  const formattedCreatedAt = Number.isNaN(createdAt.getTime())
    ? ""
    : format.dateTime(createdAt, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

  return (
    <article className="border-border-subtle bg-background-surface shadow-estimate-card rounded-16 md:rounded-20 w-full border px-20 py-20 md:px-24 md:py-24">
      <div className="flex min-w-0 flex-col gap-8">
        <div className="flex flex-wrap items-center gap-8">
          <p className="text-text-primary text-base font-semibold">{content.authorName}</p>
          <p className="text-text-muted text-sm">{formattedCreatedAt}</p>
          {content.rating !== null ? (
            <p
              className="text-sm text-amber-500"
              aria-label={t("ratingAria", { rating: content.rating })}
            >
              {renderStars(content.rating)}
            </p>
          ) : null}
          {isHidden ? (
            <span className="bg-background-brand-muted text-text-brand rounded-md px-8 py-2 text-xs font-semibold">
              {t("hiddenBadge")}
            </span>
          ) : null}
        </div>

        {content.meta ? <p className="text-text-muted text-xs">{content.meta}</p> : null}

        {content.title ? (
          <p className="text-text-primary text-sm font-semibold">{content.title}</p>
        ) : null}

        <p
          className={cn(
            "text-sm leading-relaxed",
            isHidden ? "text-text-muted" : "text-text-secondary",
          )}
        >
          {content.body}
        </p>

        {content.latestModeration?.reason ? (
          <div className="bg-background-subtle rounded-12 mt-4 px-12 py-10">
            <p className="text-text-muted text-xs font-semibold">
              {content.latestModeration.action === "HIDE" ? t("hiddenReason") : t("restoredReason")}
            </p>
            <p className="text-text-secondary mt-4 text-sm">{content.latestModeration.reason}</p>
          </div>
        ) : null}
      </div>
    </article>
  );
}
