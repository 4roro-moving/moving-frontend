"use client";

import { useState } from "react";

import { Text } from "@/components/common/Text";
import { cn } from "@/lib/utils/cn";

import DatePickerField from "./DatePickerField";
import MoveTypeCard from "./MoveTypeCard";

const MOVE_TYPES = [
  {
    id: "small",
    title: "소형이사",
    description: "원룸, 투룸, 20평대 미만",
    imageSrc: "/images/move-type/small.svg",
  },
  {
    id: "home",
    title: "가정이사",
    description: "쓰리룸, 20평대 이상",
    imageSrc: "/images/move-type/home.svg",
  },
  {
    id: "office",
    title: "사무실이사",
    description: "사무실, 상업공간",
    imageSrc: "/images/move-type/office.svg",
  },
] as const;

// 목업용 샘플 주소 (API 미연결)
const SAMPLE_REGION = "서울특별시 중구 세종대로 110";

type RegionKind = "출발지" | "도착지";

interface RegionFieldProps {
  kind: RegionKind;
  value: string | null;
  onSelect: () => void;
  onReset: () => void;
}

function RegionField({ kind, value, onSelect, onReset }: RegionFieldProps) {
  return (
    <div className="flex flex-1 flex-col justify-center gap-12">
      <div className="flex items-center justify-between">
        <Text as="span" variant="lg-medium" className="text-text-primary">
          {kind}
        </Text>
        {value && (
          <button type="button" onClick={onReset}>
            <Text
              as="span"
              variant="md-medium"
              className="text-text-subtle hover:text-text-primary underline underline-offset-2"
            >
              수정하기
            </Text>
          </button>
        )}
      </div>
      {value ? (
        <div className="rounded-12 border-border-subtle bg-background-muted flex h-[54px] items-center border px-24 py-16">
          <Text as="p" variant="lg-medium" className="text-text-secondary truncate">
            {value}
          </Text>
        </div>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="rounded-12 border-border-brand hover:bg-background-brand-muted flex h-[54px] items-center border px-24 py-16 transition-colors"
        >
          <Text as="span" variant="lg-semibold" className="text-text-brand">
            {kind} 선택하기
          </Text>
        </button>
      )}
    </div>
  );
}

export default function EstimateRequestForm() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  // 오늘 날짜를 초기 선택값으로 사용한다.
  const [moveDate, setMoveDate] = useState<Date>(() => new Date());
  const [fromRegion, setFromRegion] = useState<string | null>(null);
  const [toRegion, setToRegion] = useState<string | null>(null);

  const canSubmit = Boolean(selectedType && fromRegion && toRegion);

  return (
    <div className="rounded-40 bg-background-surface mx-auto flex w-full max-w-[894px] flex-col px-24 pt-48 pb-40 md:px-[47px] md:pt-[89px] md:pb-[76px]">
      {/* Title */}
      <div className="flex flex-col items-center gap-8 text-center">
        <Text as="h1" variant="2xl-bold" className="text-text-primary">
          이사 유형, 예정일과 지역을 선택해주세요
        </Text>
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          견적을 요청하면 최대 5개의 견적을 받을 수 있어요 :)
        </Text>
      </div>

      {/* Form fields */}
      <div className="mt-64 flex flex-col gap-64 md:mt-80">
        {/* 이사 유형 */}
        <section className="flex flex-col gap-16">
          <Text as="h2" variant="2lg-bold" className="text-text-tertiary">
            이사 유형
          </Text>
          <div className="flex flex-col gap-16 sm:flex-row">
            {MOVE_TYPES.map((type) => (
              <MoveTypeCard
                key={type.id}
                title={type.title}
                description={type.description}
                imageSrc={type.imageSrc}
                selected={selectedType === type.id}
                onSelect={() => setSelectedType(type.id)}
              />
            ))}
          </div>
        </section>

        {/* 이사 예정일 & 이사 지역 */}
        <section className="flex flex-col gap-32">
          {/* 이사 예정일 */}
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <Text as="h2" variant="2lg-bold" className="text-text-tertiary">
              이사 예정일
            </Text>
            <DatePickerField
              value={moveDate}
              onChange={setMoveDate}
              className="w-full md:w-[400px]"
            />
          </div>

          <div className="bg-border-subtle h-px w-full" />

          {/* 이사 지역 */}
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <Text as="h2" variant="2lg-bold" className="text-text-tertiary">
              이사 지역
            </Text>
            <div className="flex w-full gap-16 md:w-[520px]">
              <RegionField
                kind="출발지"
                value={fromRegion}
                onSelect={() => setFromRegion(SAMPLE_REGION)}
                onReset={() => setFromRegion(null)}
              />
              <RegionField
                kind="도착지"
                value={toRegion}
                onSelect={() => setToRegion(SAMPLE_REGION)}
                onReset={() => setToRegion(null)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* CTA */}
      <div className="mt-64 flex justify-end md:mt-80">
        <button
          type="button"
          disabled={!canSubmit}
          className={cn(
            "rounded-16 flex h-64 w-full items-center justify-center px-16 transition-colors md:w-[200px]",
            canSubmit
              ? "bg-background-brand hover:bg-background-brand-hover"
              : "bg-background-disabled cursor-not-allowed",
          )}
        >
          <Text as="span" variant="2lg-semibold" className="text-text-inverse">
            견적 요청하기
          </Text>
        </button>
      </div>
    </div>
  );
}
