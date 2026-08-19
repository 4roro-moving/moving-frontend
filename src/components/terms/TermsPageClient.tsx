"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/common/Text";
import TermsContent from "@/components/terms/TermsContent";
import { usePublishedTerms } from "@/hooks/terms/usePublishedTerms";
import { cn } from "@/lib/utils/cn";
import type { PublishedTerms, TermsType } from "@/types/terms";
import { TERMS_TYPE_LABEL, TERMS_TYPE_ORDER } from "@/types/terms";

type TabValue = "ALL" | TermsType;

const formatEffectiveDate = (value: string | null) =>
  value ? value.slice(0, 10).replace(/-/g, ".") : null;

/** 유형 라벨과 버전 정보. 목록과 상세가 공유합니다. */
const TermsMeta = ({ terms }: { terms: PublishedTerms }) => {
  const effectiveDate = formatEffectiveDate(terms.effectiveAt);

  return (
    <>
      <div className="flex items-center gap-8">
        <Text as="span" variant="sm-medium" className="text-text-brand">
          {TERMS_TYPE_LABEL[terms.type]}
        </Text>

        {!terms.isRequired && (
          <Text as="span" variant="sm-medium" className="text-text-muted">
            선택 동의
          </Text>
        )}
      </div>

      <Text as="p" variant="sm-medium" className="text-text-muted">
        버전 {terms.version}
        {effectiveDate ? ` · ${effectiveDate} 시행` : ""}
      </Text>
    </>
  );
};

/** 전체 탭의 목록 항목. 누르면 해당 유형 탭으로 전환됩니다. */
const TermsListItem = ({
  terms,
  onSelect,
}: {
  terms: PublishedTerms;
  onSelect: (type: TermsType) => void;
}) => (
  <li>
    <button
      type="button"
      onClick={() => onSelect(terms.type)}
      className={cn(
        "border-border-default rounded-12 hover:bg-background-subtle flex w-full flex-col gap-4 border px-20 py-16 text-left transition-colors",
        "focus-visible:ring-border-brand focus-visible:ring-1 focus-visible:outline-none",
      )}
    >
      <TermsMeta terms={terms} />

      <Text as="span" variant={{ base: "lg-bold", md: "2lg-bold" }} className="text-text-primary">
        {terms.title}
      </Text>
    </button>
  </li>
);

/** 개별 탭의 상세. 본문 전문을 렌더링합니다. */
const TermsDetail = ({ terms }: { terms: PublishedTerms }) => (
  <article className="flex w-full flex-col gap-12 py-8">
    <header className="flex flex-col gap-4">
      <TermsMeta terms={terms} />

      <Text as="h2" variant={{ base: "2lg-bold", md: "xl-bold" }} className="text-text-primary">
        {terms.title}
      </Text>
    </header>

    <TermsContent content={terms.content} />
  </article>
);

const StateMessage = ({ children }: { children: string }) => (
  <div className="flex min-h-[240px] w-full items-center justify-center">
    <Text as="p" variant="md-medium" className="text-text-muted">
      {children}
    </Text>
  </div>
);

const TermsPageClient = () => {
  const [selectedTab, setSelectedTab] = useState<TabValue>("ALL");
  const { data, isPending, isError, refetch } = usePublishedTerms();

  const termsList = useMemo(() => data ?? [], [data]);

  /** 게시된 약관이 있는 유형만 탭으로 노출합니다. */
  const availableTabs = useMemo<TabValue[]>(() => {
    const publishedTypes = new Set(termsList.map((terms) => terms.type));
    return ["ALL", ...TERMS_TYPE_ORDER.filter((type) => publishedTypes.has(type))];
  }, [termsList]);

  /**
   * 게시 상태가 바뀌어 선택한 탭이 목록에서 사라지면 전체로 되돌립니다.
   * useEffect 로 동기화하면 되돌리기 전 한 프레임 동안 빈 화면이 보이므로
   * 렌더 중에 파생 값으로 계산합니다.
   */
  const activeTab = availableTabs.includes(selectedTab) ? selectedTab : "ALL";

  /** 전체 탭 목록. 유형 순서로 정렬합니다. */
  const orderedTerms = useMemo(
    () => TERMS_TYPE_ORDER.flatMap((type) => termsList.filter((terms) => terms.type === type)),
    [termsList],
  );

  /** 유형별 게시본은 하나뿐이므로 find 로 충분합니다. */
  const selectedTerms = useMemo(() => {
    if (activeTab === "ALL") return null;
    return termsList.find((terms) => terms.type === activeTab) ?? null;
  }, [termsList, activeTab]);

  const handleSelectTab = (tab: TabValue) => {
    setSelectedTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderBody = () => {
    if (isPending) {
      return <StateMessage>약관을 불러오는 중이에요</StateMessage>;
    }

    if (isError) {
      return (
        <div className="flex min-h-[240px] w-full flex-col items-center justify-center gap-12">
          <Text as="p" variant="md-medium" className="text-text-muted">
            약관을 불러오지 못했어요
          </Text>

          <button
            type="button"
            onClick={() => void refetch()}
            className="border-border-brand text-text-brand rounded-8 focus-visible:ring-border-brand border px-16 py-8 focus-visible:ring-1 focus-visible:outline-none"
          >
            <Text as="span" variant="md-medium">
              다시 불러오기
            </Text>
          </button>
        </div>
      );
    }

    if (activeTab === "ALL") {
      if (orderedTerms.length === 0) {
        return <StateMessage>등록된 약관이 없습니다</StateMessage>;
      }

      return (
        <ul className="flex w-full flex-col gap-12">
          {orderedTerms.map((terms) => (
            <TermsListItem key={terms.id} terms={terms} onSelect={handleSelectTab} />
          ))}
        </ul>
      );
    }

    if (!selectedTerms) {
      return <StateMessage>등록된 약관이 없습니다</StateMessage>;
    }

    return <TermsDetail terms={selectedTerms} />;
  };

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col gap-24 py-32 md:px-40 md:py-48">
      <header className="flex flex-col gap-8">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          약관 및 정책
        </Text>

        <Text as="p" variant="lg-regular" className="text-text-secondary">
          무빙 서비스 이용에 적용되는 약관과 정책을 확인할 수 있습니다.
        </Text>
      </header>

      <nav aria-label="약관 유형" className="border-border-default border-b">
        <ul className="flex gap-4 overflow-x-auto">
          {availableTabs.map((tab) => {
            const isActive = tab === activeTab;
            const label = tab === "ALL" ? "전체" : TERMS_TYPE_LABEL[tab];

            return (
              <li key={tab} className="shrink-0">
                <button
                  type="button"
                  onClick={() => handleSelectTab(tab)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "focus-visible:ring-border-brand rounded-t-8 px-16 py-12 transition-colors focus-visible:ring-1 focus-visible:outline-none",
                    isActive
                      ? "border-border-brand text-text-brand border-b-2"
                      : "text-text-secondary hover:text-text-primary border-b-2 border-transparent",
                  )}
                >
                  <Text as="span" variant={isActive ? "lg-bold" : "lg-regular"}>
                    {label}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {renderBody()}
    </main>
  );
};

export default TermsPageClient;
