"use client";

import { useMemo, useState } from "react";

import { Text } from "@/components/common/Text";
import { useFaqs } from "@/hooks/faq/useFaqs";
import { ChevronDownIcon } from "@/icons";
import { cn } from "@/lib/utils/cn";

interface StateMessageProps {
  children: string;
}

const StateMessage = ({ children }: StateMessageProps) => (
  <div className="flex min-h-240 w-full items-center justify-center">
    <Text as="p" variant="md-medium" className="text-text-muted">
      {children}
    </Text>
  </div>
);

const FaqPageClient = () => {
  const [keyword, setKeyword] = useState("");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);

  const { data, isPending, isError, refetch } = useFaqs();

  const filteredFaqs = useMemo(() => {
    const faqs = data ?? [];
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return faqs;
    }

    return faqs.filter((faq) => {
      const question = faq.question.toLowerCase();
      const answer = faq.answer.toLowerCase();

      return question.includes(normalizedKeyword) || answer.includes(normalizedKeyword);
    });
  }, [data, keyword]);

  const handleToggle = (faqId: number) => {
    setOpenFaqId((current) => (current === faqId ? null : faqId));
  };

  const renderBody = () => {
    if (isPending) {
      return <StateMessage>자주 묻는 질문을 불러오는 중이에요</StateMessage>;
    }

    if (isError) {
      return (
        <div className="flex min-h-240 flex-col items-center justify-center gap-12">
          <Text as="p" variant="md-medium" className="text-text-muted">
            자주 묻는 질문을 불러오지 못했어요
          </Text>

          <button
            type="button"
            onClick={() => void refetch()}
            className="border-border-brand text-text-brand rounded-8 border px-16 py-8"
          >
            <Text as="span" variant="md-medium">
              다시 불러오기
            </Text>
          </button>
        </div>
      );
    }

    if (filteredFaqs.length === 0) {
      return (
        <StateMessage>
          {keyword.trim() ? "검색 결과가 없습니다" : "등록된 자주 묻는 질문이 없습니다"}
        </StateMessage>
      );
    }

    return (
      <ul className="border-border-default border-t">
        {filteredFaqs.map((faq) => {
          const isOpen = openFaqId === faq.id;
          const panelId = `faq-answer-${faq.id}`;
          const buttonId = `faq-question-${faq.id}`;

          return (
            <li key={faq.id} className="border-border-default border-b">
              <button
                id={buttonId}
                type="button"
                onClick={() => handleToggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="hover:bg-background-subtle focus-visible:ring-border-brand flex w-full items-center gap-16 px-8 py-20 text-left transition-colors focus-visible:ring-1 focus-visible:outline-none md:px-16"
              >
                <Text
                  as="span"
                  variant={{ base: "lg-bold", md: "2lg-bold" }}
                  className="text-text-brand shrink-0"
                >
                  Q
                </Text>

                <Text
                  as="span"
                  variant={{ base: "md-medium", md: "lg-medium" }}
                  className="text-text-primary min-w-0 flex-1"
                >
                  {faq.question}
                </Text>

                <ChevronDownIcon
                  aria-hidden
                  className={cn(
                    "text-icon-muted size-24 shrink-0 transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className={cn(
                  "grid transition-[grid-template-rows] duration-200 ease-out",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <div className="bg-background-subtle flex gap-16 px-8 py-20 md:px-16 md:py-24">
                    <Text
                      as="span"
                      variant={{ base: "lg-bold", md: "2lg-bold" }}
                      className="text-text-secondary shrink-0"
                    >
                      A
                    </Text>

                    <Text
                      as="p"
                      variant={{
                        base: "md-regular",
                        md: "lg-regular",
                      }}
                      className="text-text-secondary wrap-break-word whitespace-pre-wrap"
                    >
                      {faq.answer}
                    </Text>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <main className="px-margin-mobile max-w-container-desktop mx-auto flex w-full flex-col gap-28 py-32 md:px-40 md:py-48">
      <header className="flex flex-col gap-8">
        <Text as="h1" variant={{ base: "2xl-bold", md: "3xl-bold" }} className="text-text-primary">
          자주 묻는 질문
        </Text>

        <Text as="p" variant="lg-regular" className="text-text-secondary">
          서비스 이용 중 자주 묻는 내용을 확인할 수 있습니다.
        </Text>
      </header>

      <section className="flex flex-col gap-24">
        <div className="relative w-full max-w-[600px]">
          <label htmlFor="faq-keyword" className="sr-only">
            자주 묻는 질문 검색
          </label>

          <input
            id="faq-keyword"
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="궁금한 내용을 검색해 주세요"
            className="border-border-default text-text-primary placeholder:text-text-muted rounded-8 focus:border-border-brand w-full border px-16 py-12 outline-none"
          />
        </div>

        {renderBody()}
      </section>
    </main>
  );
};

export default FaqPageClient;
