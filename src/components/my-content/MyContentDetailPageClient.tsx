"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";

import EstimatesQueryStatus from "@/components/estimate/EstimatesQueryStatus";
import ModeratedContentCard from "@/components/my-content/ModeratedContentCard";
import { Text } from "@/components/common/Text";
import { useMyContentDetail } from "@/hooks/useMyContentDetail";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { isMyContentType, type MyContentType } from "@/types/myContent";

const PAGE_TITLE_BY_TYPE: Record<MyContentType, string> = {
  review: "숨김 처리된 리뷰",
  "residence-review": "숨김 처리된 거주후기",
  giveaway: "숨김 처리된 나눔게시물",
};

function parseContentId(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
}

export default function MyContentDetailPageClient() {
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
      return "콘텐츠 처리 안내";
    }
    if (data && !data.isHidden) {
      return PAGE_TITLE_BY_TYPE[contentType].replace("숨김 처리된 ", "처리된 ");
    }
    return PAGE_TITLE_BY_TYPE[contentType];
  }, [contentType, data]);

  if (!isValidParams) {
    return <EstimatesQueryStatus message="올바르지 않은 콘텐츠 링크입니다." />;
  }

  if (isLoading) {
    return <EstimatesQueryStatus message="콘텐츠를 불러오는 중입니다." />;
  }

  if (isError) {
    return (
      <EstimatesQueryStatus
        message={getApiErrorMessage(error, "콘텐츠를 불러오지 못했습니다.")}
        actionLabel="다시 시도"
        onAction={() => {
          void refetch();
        }}
        actionBusy={isFetching}
      />
    );
  }

  if (!data) {
    return <EstimatesQueryStatus message="표시할 콘텐츠가 없습니다." />;
  }

  return (
    <section className="px-margin-mobile md:px-margin-tablet mx-auto flex w-full max-w-[720px] flex-col items-center gap-24 py-40 md:py-64 xl:px-0">
      <header className="flex w-full flex-col items-center gap-8 text-center">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          {pageTitle}
        </Text>
        <Text as="p" variant="md-regular" className="text-text-muted">
          관리자 처리 결과와 사유를 확인할 수 있습니다.
        </Text>
      </header>

      <div className="w-full">
        <ModeratedContentCard content={data} />
      </div>
    </section>
  );
}
