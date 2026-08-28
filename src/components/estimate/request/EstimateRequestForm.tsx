"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import { useActiveEstimateRequest } from "@/hooks/useActiveEstimateRequest";
import { useCreateEstimateRequest } from "@/hooks/useCreateEstimateRequest";
import { getLoginRedirectPath } from "@/lib/auth/session";
import { ADDRESS_DIRECTION, type AddressDirection } from "@/lib/constants/address";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { MOVE_TYPE_CARDS } from "@/lib/constants/moveType";
import { normalizeRoadAddress } from "@/lib/kakao/addressSearch";
import { markInternalDetailNavigationOnClick } from "@/lib/utils/detailNavigation";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/useAuthStore";
import type { MoveType } from "@/types/move";

import ActiveEstimateBlocked from "./ActiveEstimateBlocked";
import AddressSelectModal, { type AddressItem } from "./AddressSelectModal";
import Calendar from "./Calendar";
import DatePickerField from "./DatePickerField";
import MoveTypeCard from "./MoveTypeCard";

const HOME_PATH = "/";
const FORBIDDEN_REDIRECT_DELAY_MS = 1500;

type MobileStep = 1 | 2 | 3;

function StepIndicator({ current }: { current: MobileStep }) {
  const t = useTranslations("estimateRequest");
  return (
    <div className="flex items-center gap-8" aria-label={t("stepAria", { current })}>
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
  kind: AddressDirection;
  value: string | null;
  detailValue: string;
  onSelect: () => void;
  onReset: () => void;
  onDetailChange: (value: string) => void;
}

const DETAIL_ADDRESS_MAX_LENGTH = 255;

function RegionField({
  kind,
  value,
  detailValue,
  onSelect,
  onReset,
  onDetailChange,
}: RegionFieldProps) {
  const t = useTranslations("estimateRequest");
  const isFrom = kind === ADDRESS_DIRECTION.FROM;
  const kindLabel = isFrom ? t("fromAddress") : t("toAddress");
  const detailInputId = `${kind}-detail-address`;

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-12">
      <Text as="span" variant="lg-medium" className="text-text-primary">
        {kindLabel}
      </Text>
      <div className="flex min-w-0 flex-col items-end gap-8">
        {value ? (
          <div className="rounded-12 border-border-brand flex h-[54px] w-full min-w-0 items-center overflow-hidden border px-24 py-16">
            <Text
              as="p"
              variant="lg-medium"
              title={value}
              className="text-text-brand block w-full min-w-0 truncate"
            >
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
              {t("selectAddressKind", { kind: kindLabel })}
            </Text>
          </button>
        )}

        <label htmlFor={detailInputId} className="sr-only">
          {t("detailAddressLabel", { kind: kindLabel })}
        </label>
        <input
          id={detailInputId}
          type="text"
          value={detailValue}
          onChange={(event) => onDetailChange(event.target.value)}
          maxLength={DETAIL_ADDRESS_MAX_LENGTH}
          placeholder={value ? t("detailAddressPlaceholder") : t("selectAddressFirst")}
          disabled={!value}
          className={cn(
            "rounded-12 border-border-brand text-text-brand placeholder:text-text-weak",
            "flex h-[54px] w-full min-w-0 items-center border bg-transparent px-24 py-16",
            "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-medium",
            "focus-visible:ring-border-brand focus-visible:ring-1 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        />

        {/* 수정하기 영역 높이 고정 → 주소 입력 전후 레이아웃이 밀리지 않음 */}
        <div className="flex h-[26px] w-full items-center justify-end">
          {value && (
            <button type="button" onClick={onReset}>
              <Text
                as="span"
                variant="md-medium"
                className="text-text-subtle hover:text-text-primary"
              >
                {t("editAddress")}
              </Text>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EstimateRequestForm() {
  const t = useTranslations("estimateRequest");
  const mobileStepTitles: Record<MobileStep, string> = {
    1: t("stepMoveType"),
    2: t("stepMoveDate"),
    3: t("stepRegion"),
  };
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userRole = useAuthStore((state) => state.user?.role ?? null);

  const [mobileStep, setMobileStep] = useState<MobileStep>(1);
  const [selectedType, setSelectedType] = useState<MoveType | null>(null);
  const [moveDate, setMoveDate] = useState<Date>(() => new Date());
  const [fromAddress, setFromAddress] = useState<AddressItem | null>(null);
  const [toAddress, setToAddress] = useState<AddressItem | null>(null);
  const [fromDetailAddress, setFromDetailAddress] = useState("");
  const [toDetailAddress, setToDetailAddress] = useState("");
  const [addressModalKind, setAddressModalKind] = useState<AddressDirection | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAccessDeniedToastVisible, setIsAccessDeniedToastVisible] = useState(true);

  const isAuthReady = hasHydrated && !isCheckingAuth;
  const isCustomer = userRole === "CUSTOMER";

  const canSubmit = Boolean(selectedType && fromAddress && toAddress);
  const canGoNext =
    mobileStep === 1 ? Boolean(selectedType) : mobileStep === 2 ? Boolean(moveDate) : canSubmit;

  const closeToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const closeAccessDeniedToast = useCallback(() => {
    setIsAccessDeniedToastVisible(false);
  }, []);

  // 2026.07.30 정슬기 - [수정] hasAuthSession + getLoginRedirectPath (dev 로그인 연동)
  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated) {
      router.replace(getLoginRedirectPath());
    }
  }, [isAuthReady, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthReady || !isAuthenticated || isCustomer) return;

    const timeoutId = window.setTimeout(() => {
      router.replace(HOME_PATH);
    }, FORBIDDEN_REDIRECT_DELAY_MS);

    return () => window.clearTimeout(timeoutId);
  }, [isAuthReady, isAuthenticated, isCustomer, router]);

  const {
    data: activeRequest,
    isLoading: isActiveLoading,
    isError: isActiveError,
  } = useActiveEstimateRequest({
    enabled: isAuthReady && isCustomer,
  });

  const createMutation = useCreateEstimateRequest({
    onError: (message) => {
      setToastMessage(message);
    },
  });

  function handleAddressConfirm(address: AddressItem) {
    if (addressModalKind === ADDRESS_DIRECTION.FROM) {
      // 기존 주소를 다른 주소로 바꿀 때만 상세주소를 초기화한다
      if (fromAddress != null) {
        setFromDetailAddress("");
      }
      setFromAddress(address);
    }
    if (addressModalKind === ADDRESS_DIRECTION.TO) {
      if (toAddress != null) {
        setToDetailAddress("");
      }
      setToAddress(address);
    }
    setAddressModalKind(null);
  }

  function handleSubmit() {
    if (!selectedType || !fromAddress || !toAddress) return;
    if (createMutation.isPending) return;

    if (!isAuthReady) return;

    if (!isAuthenticated) {
      router.replace(getLoginRedirectPath());
      return;
    }

    if (!isCustomer) {
      setToastMessage(t("forbiddenRole"));
      router.replace(HOME_PATH);
      return;
    }

    if (!/^\d{5}$/.test(fromAddress.zipCode) || !/^\d{5}$/.test(toAddress.zipCode)) {
      setToastMessage(t("invalidZip"));
      return;
    }

    createMutation.submitEstimateRequest({
      moveType: selectedType,
      moveDate,
      from: fromAddress,
      to: toAddress,
      fromDetailAddress,
      toDetailAddress,
    });
  }

  function handleMobileNext() {
    if (mobileStep < 3) {
      setMobileStep((step) => (step + 1) as MobileStep);
      return;
    }
    handleSubmit();
  }

  const isBusy = createMutation.isPending;
  const isAccessDenied = isAuthReady && isAuthenticated && !isCustomer;
  const isCheckingActive =
    !isAuthReady || !isAuthenticated || isAccessDenied || (isCustomer && isActiveLoading);

  const accessDeniedToastMessage =
    isAccessDenied && isAccessDeniedToastVisible ? t("forbiddenRole") : null;

  const visibleToastMessage = toastMessage ?? accessDeniedToastMessage;

  const toastElement = visibleToastMessage ? (
    <Toast onClose={toastMessage ? closeToast : closeAccessDeniedToast}>
      {visibleToastMessage}
    </Toast>
  ) : null;

  if (isCheckingActive) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        {toastElement}
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          {t("loading")}
        </Text>
      </div>
    );
  }

  // 생성 성공 후 ACTIVE 캐시가 채워지면 ActiveEstimateBlocked가 잠깐 보일 수 있어
  // 목록 이동이 끝나기 전에는 안내 화면 대신 로딩만 유지한다.
  if (createMutation.isSuccess) {
    return (
      <div className="flex min-h-[40vh] w-full items-center justify-center">
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          {t("loading")}
        </Text>
      </div>
    );
  }

  if (isActiveError) {
    return (
      <>
        {toastElement}
        <ActiveEstimateBlocked description={t("activeLoadFailed")} />
      </>
    );
  }

  if (activeRequest) {
    const isConfirmedRequest = activeRequest.status === "CONFIRMED";
    const activeRequestDetailHref = APP_ROUTES.ESTIMATES.REQUEST_DETAIL(activeRequest.id);

    return (
      <>
        {toastElement}
        <ActiveEstimateBlocked
          imageSrc="/images/empty/moving-car.png"
          description={
            isConfirmedRequest ? (
              <>
                {t("activeConfirmedLine1")}
                <br />
                {t("activeConfirmedLine2")}
              </>
            ) : (
              <>
                {t("activeBlockedTitle")}
                <br />
                {t("activeBlockedDescription")}
              </>
            )
          }
          buttonLabel={isConfirmedRequest ? t("viewActiveConfirmed") : t("viewPending")}
          href={isConfirmedRequest ? activeRequestDetailHref : APP_ROUTES.ESTIMATES.PENDING}
          onButtonClick={
            isConfirmedRequest
              ? (event) => markInternalDetailNavigationOnClick(event, activeRequestDetailHref)
              : undefined
          }
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
      {toastElement}

      {/* Desktop title */}
      <div className="hidden flex-col items-center gap-8 text-center md:flex">
        <Text as="h1" variant="2xl-bold" className="text-text-primary">
          {t("title")}
        </Text>
        <Text as="p" variant="lg-regular" className="text-text-subtle">
          {t("description")}
        </Text>
      </div>

      {/* Mobile title + step indicator */}
      <div className="flex flex-col items-center gap-8 text-center md:hidden">
        <StepIndicator current={mobileStep} />
        <div className="flex flex-col items-center">
          <Text as="h1" variant="xl-bold" className="text-text-primary">
            {mobileStepTitles[mobileStep]}
          </Text>
          <Text as="p" variant="md-regular" className="text-text-subtle">
            {t("description")}
          </Text>
        </div>
      </div>

      <div className="mt-32 flex flex-1 flex-col md:mt-80">
        {/* Step 1: 이사 유형 */}
        <section
          className={cn("flex flex-col gap-16 md:mb-64", mobileStep !== 1 && "hidden md:flex")}
        >
          <Text as="h2" variant="2lg-bold" className="text-text-tertiary hidden md:block">
            {t("moveType")}
          </Text>
          <div className="flex flex-col gap-16 md:flex-row">
            {MOVE_TYPE_CARDS.map((type) => (
              <MoveTypeCard
                key={type.id}
                title={t(`moveTypes.${type.id}.title`)}
                description={t(`moveTypes.${type.id}.description`)}
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
              {t("moveDate")}
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
              {t("region")}
            </Text>
            <div className="flex w-full min-w-0 flex-col gap-24 md:w-[520px] md:max-w-full md:flex-row md:gap-16">
              <RegionField
                kind={ADDRESS_DIRECTION.FROM}
                value={fromAddress ? normalizeRoadAddress(fromAddress.roadAddress) : null}
                detailValue={fromDetailAddress}
                onSelect={() => setAddressModalKind(ADDRESS_DIRECTION.FROM)}
                onReset={() => setAddressModalKind(ADDRESS_DIRECTION.FROM)}
                onDetailChange={setFromDetailAddress}
              />
              <RegionField
                kind={ADDRESS_DIRECTION.TO}
                value={toAddress ? normalizeRoadAddress(toAddress.roadAddress) : null}
                detailValue={toDetailAddress}
                onSelect={() => setAddressModalKind(ADDRESS_DIRECTION.TO)}
                onReset={() => setAddressModalKind(ADDRESS_DIRECTION.TO)}
                onDetailChange={setToDetailAddress}
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
              {t("previous")}
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
                ? t("requesting")
                : t("submit")
              : t("next")}
          </Text>
        </button>
      </div>

      {/* Desktop CTA */}
      <div className="mt-80 hidden justify-end md:flex">
        <button
          type="button"
          disabled={!canSubmit || isBusy}
          onClick={handleSubmit}
          className={cn(
            "rounded-16 flex h-64 w-[200px] items-center justify-center px-16 transition-colors",
            canSubmit && !isBusy
              ? "bg-background-brand hover:bg-background-brand-hover"
              : "bg-background-disabled cursor-not-allowed",
          )}
        >
          <Text as="span" variant="2lg-semibold" className="text-text-inverse">
            {createMutation.isPending ? t("requesting") : t("submit")}
          </Text>
        </button>
      </div>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={addressModalKind === ADDRESS_DIRECTION.FROM ? t("fromAddress") : t("toAddress")}
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </div>
  );
}
