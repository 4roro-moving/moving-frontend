"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useParams } from "next/navigation";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ModeratedContentCard from "@/components/my-content/ModeratedContentCard";
import { Text } from "@/components/common/Text";
import { useMyContentDetail } from "@/hooks/useMyContentDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { isMyContentType, type MyContentType } from "@/types/myContent";

function parseContentId(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

export default function MyContentDetailPageClient() {
  const t = useTranslations("myContent");
  const params = useParams<{ contentType: string; contentId: string }>();

  const contentTypeParam = Array.isArray(params.contentType)
    ? params.contentType[0]
    : params.contentType;
  const contentType: MyContentType | null =
    typeof contentTypeParam === "string" && isMyContentType(contentTypeParam)
      ? contentTypeParam
      : null;
  const contentId = parseContentId(params.contentId);

  const isValidParams = contentType !== null && contentId > 0;

  const { data, isLoading, isError, error, refetch, isFetching } = useMyContentDetail({
    contentType: contentType ?? "review",
    contentId,
    enabled: isValidParams,
  });

  const pageTitle = useMemo(() => {
    if (!contentType) {
      return t("processingTitle");
    }
    if (data && !data.isHidden) {
      return t(`restoredTitle.${contentType}`);
    }
    return t(`hiddenTitle.${contentType}`);
  }, [contentType, data, t]);

  if (!isValidParams) {
    return <EstimatesQueryStatus message={t("invalidLink")} />;
  }

  if (isLoading) {
    return <EstimatesQueryStatus message={t("loading")} />;
  }

  if (isError) {
    return (
      <EstimatesQueryStatus
        message={getApiErrorMessage(error, t("loadFailed"))}
        actionLabel={t("retry")}
        onAction={() => {
          void refetch();
        }}
        actionBusy={isFetching}
      />
    );
  }

  if (!data) {
    return <EstimatesQueryStatus message={t("empty")} />;
  }

  return (
    <section className="px-margin-mobile md:px-margin-tablet mx-auto flex w-full max-w-[720px] flex-col items-center gap-24 py-40 md:py-64 xl:px-0">
      <header className="flex w-full flex-col items-center gap-8 text-center">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          {pageTitle}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          {t("description")}
        </Text>
      </header>

      <div className="w-full">
        <ModeratedContentCard content={data} />
      </div>
    </section>
  );
}
