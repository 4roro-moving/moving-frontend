"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast";
import { useActiveEstimateRequest } from "@/hooks/useActiveEstimateRequest";
import { login, refreshSession } from "@/lib/api/auth";
import {
  buildCreateEstimateRequestPayload,
  createEstimateRequest,
} from "@/lib/api/estimateRequest";
import { getApiError } from "@/lib/api/getApiError";
import { getAccessToken } from "@/lib/auth/token";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { normalizeRoadAddress } from "@/lib/kakao/addressSearch";
import { cn } from "@/lib/utils/cn";

import ActiveEstimateBlocked from "./ActiveEstimateBlocked";
import AddressSelectModal, { type AddressItem } from "./AddressSelectModal";
import Calendar from "./Calendar";
import DatePickerField from "./DatePickerField";
import MoveTypeCard from "./MoveTypeCard";

// 로컬 테스트용 고객 계정 (로그인 화면 연동 전 임시)
const TEST_CUSTOMER = {
  email: "customer1@test.com",
  password: "Moving123!",
} as const;

const TOAST_SUCCESS_MESSAGE = "견적 요청이 완료되었습니다.";
const TOAST_FAILURE_MESSAGE = "견적 요청이 실패하였습니다.";
const TOAST_EXISTING_REQUEST_MESSAGE =
  "견적 요청에 실패하였습니다. 기존 견적이 있는지 확인해주세요.";
const TOAST_INVALID_ZIP_MESSAGE = "우편번호 정보가 올바르지 않습니다. 주소를 다시 선택해주세요.";
const TOAST_LOGIN_FAILURE_MESSAGE = "로그인에 실패하였습니다. 잠시 후 다시 시도해주세요.";
const ACTIVE_ESTIMATE_LOAD_ERROR_MESSAGE = "고객님의 견적 정보를 불러오지 못했습니다.";

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

const MOBILE_STEP_TITLES = {
  1: "이사 유형을 선택해주세요",
  2: "이사 예정일을 선택해주세요",
  3: "이사 지역을 선택해주세요",
} as const;

type MoveTypeId = (typeof MOVE_TYPES)[number]["id"];
type RegionKind = "출발지" | "도착지";
type MobileStep = 1 | 2 | 3;

function getCreateEstimateErrorMessage(error: unknown): string {
  const { code } = getApiError(error);

  if (code === "ACTIVE_REQUEST_EXISTS") {
    return TOAST_EXISTING_REQUEST_MESSAGE;
  }

  return TOAST_FAILURE_MESSAGE;
}

function StepIndicator({ current }: { current: MobileStep }) {
  return (
    <div className="flex items-center gap-8" aria-label={`3단계 중 ${current}단계`}>
      {([1, 2, 3] as const).map((page) => {
        const isActive = page === current;
        return (
          <span
            key={page}
            className={cn(
              "flex size-20 items-center justify-center rounded-full",
              isActive ? "bg-background-brand" : "bg-background-muted",
            )}
          >
            <Text
              as="span"
              variant="xs-semibold"
              className={isActive ? "text-text-inverse" : "text-text-weak"}
            >
              {page}
            </Text>
          </span>
        );
      })}
    </div>
  );
}

interface RegionFieldProps {
  kind: RegionKind;
  value: string | null;
  onSelect: () => void;
  onReset: () => void;
}

function RegionField({ kind, value, onSelect, onReset }: RegionFieldProps) {
  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <Text as="span" variant="lg-medium" className="text-text-primary">
        {kind}
      </Text>
      <div className="flex flex-col items-end gap-8">
        {value ? (
          <div className="rounded-12 border-border-brand flex h-[54px] w-full items-center border px-24 py-16">
            <Text as="p" variant="lg-medium" className="text-text-brand truncate">
              {value}
            </Text>
          </div>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="rounded-12 border-border-brand hover:bg-background-brand-muted flex h-[54px] w-full items-center border px-24 py-16 transition-colors"
          >
            <Text as="span" variant="lg-semibold" className="text-text-brand">
              {kind} 선택하기
            </Text>
          </button>
        )}
        {/* 수정하기 영역 높이 고정 → 주소 입력 전후 레이아웃이 밀리지 않음 */}
        <div className="flex h-[26px] w-full items-center justify-end">
          {value && (
            <button type="button" onClick={onReset}>
              <Text
                as="span"
                variant="md-medium"
                className="text-text-subtle hover:text-text-primary"
              >
                수정하기
              </Text>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EstimateRequestForm() {
  const queryClient = useQueryClient();
  const [mobileStep, setMobileStep] = useState<MobileStep>(1);
  const [selectedType, setSelectedType] = useState<MoveTypeId | null>(null);
  const [moveDate, setMoveDate] = useState<Date>(() => new Date());
  const [fromAddress, setFromAddress] = useState<AddressItem | null>(null);
  const [toAddress, setToAddress] = useState<AddressItem | null>(null);
  const [addressModalKind, setAddressModalKind] = useState<RegionKind | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canSubmit = Boolean(selectedType && fromAddress && toAddress);
  const canGoNext =
    mobileStep === 1 ? Boolean(selectedType) : mobileStep === 2 ? Boolean(moveDate) : canSubmit;

  const closeToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function ensureLogin() {
      setIsLoggingIn(true);
      try {
        if (!getAccessToken()) {
          try {
            await refreshSession();
          } catch {
            await login(TEST_CUSTOMER);
          }
        }
      } catch {
        if (!cancelled) setToastMessage(TOAST_LOGIN_FAILURE_MESSAGE);
      } finally {
        if (!cancelled) {
          setIsLoggingIn(false);
          setAuthReady(true);
        }
      }
    }

    void ensureLogin();
    return () => {
      cancelled = true;
    };
  }, []);

  const {
    data: activeRequest,
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useActiveEstimateRequest({
    enabled: authReady && Boolean(getAccessToken()),
  });

  // 2026.07.26 정슬기 - [수정] 생성 성공 시 내 견적 목록 캐시 무효화 (대기 목록이 stale하지 않도록)
  // 2026.07.29 정슬기 - [수정] 조회 훅이 없는 MY_LIST 대신 실제 대기 목록 키를 무효화
  const createMutation = useMutation({
    mutationFn: createEstimateRequest,
    onSuccess: async (response) => {
      // BE GET /estimates/pending은 견적 도착 여부와 무관하게 미확정·미만료 요청을 내려주므로
      // 새 요청은 "견적 못 받은" 섹션으로 바로 노출된다. 목록이 열려 있지 않은 시점이라
      // refetchType: "none"으로 재요청 없이 stale 표시만 하고 다음 진입 때 갱신한다.
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ESTIMATES.PENDING_LIST_ROOT,
        refetchType: "none",
      });
      setToastMessage(TOAST_SUCCESS_MESSAGE);
      queryClient.setQueryData(QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE, response ?? true);
    },
    onError: async (error) => {
      const { code } = getApiError(error);
      if (code === "ACTIVE_REQUEST_EXISTS") {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ESTIMATE_REQUESTS.ACTIVE });
        return;
      }
      setToastMessage(getCreateEstimateErrorMessage(error));
    },
  });

  function handleAddressConfirm(address: AddressItem) {
    if (addressModalKind === "출발지") setFromAddress(address);
    if (addressModalKind === "도착지") setToAddress(address);
    setAddressModalKind(null);
  }

  async function handleSubmit() {
    if (!selectedType || !fromAddress || !toAddress) return;

    if (!/^\d{5}$/.test(fromAddress.zipCode) || !/^\d{5}$/.test(toAddress.zipCode)) {
      setToastMessage(TOAST_INVALID_ZIP_MESSAGE);
      return;
    }

    try {
      if (!getAccessToken()) {
        setIsLoggingIn(true);
        try {
          await refreshSession();
        } catch {
          await login(TEST_CUSTOMER);
        }
      }
    } catch {
      setToastMessage(TOAST_LOGIN_FAILURE_MESSAGE);
      return;
    } finally {
      setIsLoggingIn(false);
    }

    const payload = buildCreateEstimateRequestPayload({
      moveTypeId: selectedType,
      moveDate,
      from: fromAddress,
      to: toAddress,
    });

    createMutation.mutate(payload);
  }

  function handleMobileNext() {
    if (mobileStep < 3) {
      setMobileStep((step) => (step + 1) as MobileStep);
      return;
    }
    void handleSubmit();
  }

  const isBusy = createMutation.isPending || isLoggingIn;
  const isCheckingActive = !authReady || isActiveLoading;

  if (isCheckingActive) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        <Toast open={Boolean(toastMessage)} message={toastMessage ?? ""} onClose={closeToast} />
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          불러오는 중...
        </Text>
      </div>
    );
  }

  if (isActiveError) {
    return (
      <>
        <Toast open={Boolean(toastMessage)} message={toastMessage ?? ""} onClose={closeToast} />
        <ActiveEstimateBlocked description={ACTIVE_ESTIMATE_LOAD_ERROR_MESSAGE} />
      </>
    );
  }

  if (activeRequest) {
    return (
      <>
        <Toast open={Boolean(toastMessage)} message={toastMessage ?? ""} onClose={closeToast} />
        <ActiveEstimateBlocked
          imageSrc="/images/empty/moving-car.png"
          description={
            <>
              현재 진행 중인 이사 견적이 있어요!
              <br />
              진행 중인 이사 완료 후 새로운 견적을 받아보세요.
            </>
          }
          buttonLabel="받은 견적 보러가기"
          href="/estimates/pending"
        />
      </>
    );
  }

  return (
    <div
      className={cn(
        "bg-background-default mx-auto flex w-full max-w-[894px] flex-col px-24 pt-36 pb-[34px]",
        "md:rounded-40 md:bg-background-surface md:px-[47px] md:pt-[89px] md:pb-[76px]",
        "min-h-[100dvh] md:min-h-0",
      )}
    >
      <Toast open={Boolean(toastMessage)} message={toastMessage ?? ""} onClose={closeToast} />

      {/* Desktop title */}
      <div className="hidden flex-col items-center gap-8 text-center md:flex">
        <Text as="h1" variant="2xl-bold" className="text-text-primary">
          이사 유형, 예정일과 지역을 선택해주세요
        </Text>
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          견적을 요청하면 최대 5개의 견적을 받을 수 있어요 :)
        </Text>
      </div>

      {/* Mobile title + step indicator */}
      <div className="flex flex-col items-center gap-8 text-center md:hidden">
        <StepIndicator current={mobileStep} />
        <div className="flex flex-col items-center">
          <Text as="h1" variant="xl-bold" className="text-text-primary">
            {MOBILE_STEP_TITLES[mobileStep]}
          </Text>
          <Text as="p" variant="md-regular" className="text-text-subtle">
            견적을 요청하면 최대 5개의 견적을 받을 수 있어요 :)
          </Text>
        </div>
      </div>

      <div className="mt-32 flex flex-1 flex-col md:mt-80">
        {/* Step 1: 이사 유형 */}
        <section
          className={cn("flex flex-col gap-16 md:mb-64", mobileStep !== 1 && "hidden md:flex")}
        >
          <Text as="h2" variant="2lg-bold" className="text-text-tertiary hidden md:block">
            이사 유형
          </Text>
          <div className="flex flex-col gap-16 md:flex-row">
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

        <div className="flex flex-1 flex-col gap-32">
          {/* Step 2: 이사 예정일 */}
          <section
            className={cn(
              "flex flex-col gap-12 md:flex-row md:items-start md:justify-between",
              mobileStep !== 2 && "hidden md:flex",
            )}
          >
            <Text as="h2" variant="2lg-bold" className="text-text-tertiary hidden md:block">
              이사 예정일
            </Text>
            <DatePickerField
              value={moveDate}
              onChange={setMoveDate}
              className="hidden w-full md:block md:w-[400px]"
            />
            <Calendar selected={moveDate} onSelect={setMoveDate} className="md:hidden" />
          </section>

          <div className="bg-border-subtle hidden h-px w-full md:block" />

          {/* Step 3: 이사 지역 */}
          <section
            className={cn(
              "flex flex-col gap-12 md:flex-row md:items-start md:justify-between",
              mobileStep !== 3 && "hidden md:flex",
            )}
          >
            <Text as="h2" variant="2lg-bold" className="text-text-tertiary hidden md:block">
              이사 지역
            </Text>
            <div className="flex w-full flex-col gap-24 md:w-[520px] md:flex-row md:gap-16">
              <RegionField
                kind="출발지"
                value={fromAddress ? normalizeRoadAddress(fromAddress.roadAddress) : null}
                onSelect={() => setAddressModalKind("출발지")}
                onReset={() => setAddressModalKind("출발지")}
              />
              <RegionField
                kind="도착지"
                value={toAddress ? normalizeRoadAddress(toAddress.roadAddress) : null}
                onSelect={() => setAddressModalKind("도착지")}
                onReset={() => setAddressModalKind("도착지")}
              />
            </div>
          </section>
        </div>
      </div>

      {/* Mobile actions: 이전 / 다음(or 견적 요청하기) */}
      <div
        className={cn(
          "mt-32 flex items-center gap-8 md:hidden",
          mobileStep === 1 ? "justify-end" : "justify-stretch",
        )}
      >
        {mobileStep > 1 && (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => setMobileStep((step) => (step - 1) as MobileStep)}
            className="rounded-12 border-border-brand text-text-brand flex h-[54px] flex-1 items-center justify-center border px-24 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Text as="span" variant="lg-semibold" className="text-text-brand">
              이전
            </Text>
          </button>
        )}
        <button
          type="button"
          disabled={!canGoNext || isBusy}
          onClick={handleMobileNext}
          className={cn(
            "rounded-12 flex h-[54px] items-center justify-center px-16 transition-colors",
            mobileStep === 1 ? "w-[158px]" : "flex-1",
            canGoNext && !isBusy
              ? "bg-background-brand hover:bg-background-brand-hover"
              : "bg-background-disabled cursor-not-allowed",
          )}
        >
          <Text as="span" variant="lg-semibold" className="text-text-inverse">
            {mobileStep === 3
              ? createMutation.isPending
                ? "요청 중..."
                : "견적 요청하기"
              : "다음"}
          </Text>
        </button>
      </div>

      {/* Desktop CTA */}
      <div className="mt-80 hidden justify-end md:flex">
        <button
          type="button"
          disabled={!canSubmit || isBusy}
          onClick={() => {
            void handleSubmit();
          }}
          className={cn(
            "rounded-16 flex h-64 w-[200px] items-center justify-center px-16 transition-colors",
            canSubmit && !isBusy
              ? "bg-background-brand hover:bg-background-brand-hover"
              : "bg-background-disabled cursor-not-allowed",
          )}
        >
          <Text as="span" variant="2lg-semibold" className="text-text-inverse">
            {createMutation.isPending ? "요청 중..." : "견적 요청하기"}
          </Text>
        </button>
      </div>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={addressModalKind}
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </div>
  );
}
