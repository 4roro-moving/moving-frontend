"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import Button from "@/components/common/Button/Button";
import Toast from "@/components/common/Toast/Toast";
import { Text } from "@/components/common/Text";
import MoverCard from "@/components/mover/MoverCard";
import { MoverCardSkeletonList } from "@/components/mover/MoverCardSkeleton";
import { useFavoriteMovers } from "@/hooks/useFavoriteMovers";
import { ChevronRightThinIcon } from "@/icons";
import { FAVORITE_MOVERS_SIDEBAR_LIMIT } from "@/lib/api/favorites";
import { getLoginRedirectPath } from "@/lib/auth/session";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";

/** 사이드바 로딩 스켈레톤 카드 수 (표시 한도와 동일) */
const FAVORITE_MOVERS_SKELETON_COUNT = FAVORITE_MOVERS_SIDEBAR_LIMIT;

const SIDEBAR_PANEL_CLASS_NAME = cn(
  "border-border-subtle bg-background-surface rounded-16 flex w-full flex-col items-center gap-16 border-[0.5px] px-20 py-24",
  "shadow-[-2px_-2px_10px_0px_rgba(220,220,220,0.2),2px_2px_10px_0px_rgba(220,220,220,0.2)]",
);

interface FavoriteMoversSidebarStatusProps {
  title: string;
  description: ReactNode;
  action?:
    | { type: "link"; label: string; href: string }
    | { type: "button"; label: string; onClick: () => void; disabled?: boolean };
}

function FavoriteMoversSidebarStatus({
  title,
  description,
  action,
}: FavoriteMoversSidebarStatusProps) {
  return (
    <div className={SIDEBAR_PANEL_CLASS_NAME}>
      <div className="flex w-full flex-col items-center gap-8 text-center">
        <Text as="p" variant="lg-semibold" className="text-text-secondary">
          {title}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          {description}
        </Text>
      </div>

      {action?.type === "link" ? (
        <Button href={action.href} size="cta" fullWidth>
          {action.label}
        </Button>
      ) : null}

      {action?.type === "button" ? (
        <Button
          type="button"
          variant="outline"
          size="cta"
          fullWidth
          disabled={action.disabled}
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}

export function FavoriteMoversSidebar() {
  const t = useTranslations("favorites");
  const {
    isInitialLoading,
    isCustomerLoggedIn,
    movers: favoriteMovers,
    query,
    shouldHideForNonCustomer,
  } = useFavoriteMovers({
    limit: FAVORITE_MOVERS_SIDEBAR_LIMIT,
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (shouldHideForNonCustomer) {
    return null;
  }

  const movers = favoriteMovers.slice(0, FAVORITE_MOVERS_SIDEBAR_LIMIT);
  // 찜한 기사님이 1명 이상일 때부터 더보기 표시, 비로그인·빈 목록에서는 숨김
  const showMoreLink = isCustomerLoggedIn && !query.isError && movers.length > 0;

  return (
    <aside className="hidden w-full flex-col gap-16 xl:flex xl:w-[327px] xl:shrink-0 xl:self-stretch xl:pt-[192px]">
      <div className="flex w-full items-center justify-between gap-12">
        <Text as="h2" variant="xl-semibold" className="text-text-secondary">
          {t("sidebarTitle")}
        </Text>
        {showMoreLink ? (
          <Link
            href={APP_ROUTES.MOVERS.FAVORITES}
            className="text-text-muted hover:text-text-secondary focus-visible:ring-border-brand rounded-8 flex shrink-0 items-center gap-2 focus-visible:ring-2 focus-visible:outline-none"
          >
            <Text as="span" variant="md-medium">
              {t("more")}
            </Text>
            <ChevronRightThinIcon className="size-16" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <Text as="p" variant="md-regular" className="text-text-muted">
        {t("sidebarDescription", { count: FAVORITE_MOVERS_SIDEBAR_LIMIT })}
      </Text>

      {isInitialLoading ? (
        <MoverCardSkeletonList
          variant="compact"
          count={FAVORITE_MOVERS_SKELETON_COUNT}
          label={t("loading")}
        />
      ) : !isCustomerLoggedIn ? (
        <FavoriteMoversSidebarStatus
          title={t("loginTitle")}
          description={
            <>
              {t("loginDescriptionFirst")}
              <br />
              {t("loginDescriptionSecond")}
            </>
          }
          action={{
            type: "link",
            label: t("login"),
            href: getLoginRedirectPath(),
          }}
        />
      ) : query.isError ? (
        <FavoriteMoversSidebarStatus
          title={t("loadFailedTitle")}
          description={
            <>
              {t("loadFailedFirst")}
              <br />
              {t("loadFailedSecond")}
            </>
          }
          action={{
            type: "button",
            label: query.isFetching ? t("retrying") : t("retry"),
            onClick: () => {
              void query.refetch();
            },
            disabled: query.isFetching,
          }}
        />
      ) : movers.length === 0 ? (
        <FavoriteMoversSidebarStatus
          title={t("emptyTitle")}
          description={
            <>
              {t("sidebarEmptyFirst")}
              <br />
              {t("sidebarEmptySecond")}
            </>
          }
        />
      ) : (
        <ul className="flex flex-col gap-16">
          {movers.map((mover) => (
            <li key={mover.id}>
              <MoverCard mover={mover} variant="compact" onFavoriteError={setToastMessage} />
            </li>
          ))}
        </ul>
      )}

      {toastMessage ? <Toast onClose={() => setToastMessage(null)}>{toastMessage}</Toast> : null}
    </aside>
  );
}
