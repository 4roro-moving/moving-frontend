"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import AddressSelectModal, {
  type AddressItem,
} from "@/components/estimate/request/AddressSelectModal";
import { useRouteDistance } from "@/hooks/useRouteDistance";
import { cn } from "@/lib/utils/cn";
import type {
  PricePredictionLoadAmount,
  PricePredictionMoveType,
  PricePredictionRequest,
} from "@/types/pricePrediction";

interface PricePredictionFormProps {
  isPending: boolean;
  onSubmit: (data: PricePredictionRequest) => void;
}

type RegionKind = "출발지" | "도착지";

const MOVE_TYPES: {
  value: PricePredictionMoveType;
  label: string;
}[] = [
  {
    value: "SMALL",
    label: "소형/원룸",
  },
  {
    value: "HOME",
    label: "가정 이사",
  },
  {
    value: "OFFICE",
    label: "사무실 이사",
  },
];

const LOAD_AMOUNTS: {
  value: PricePredictionLoadAmount;
  label: string;
}[] = [
  {
    value: "LOW",
    label: "적음",
  },
  {
    value: "MEDIUM",
    label: "보통",
  },
  {
    value: "HIGH",
    label: "많음",
  },
];

const today = new Date().toISOString().slice(0, 10);

const inputClassName = cn(
  "rounded-12 border-border-default text-text-primary",
  "h-[54px] w-full border bg-white px-20",
  "text-[length:var(--font-size-16)] leading-[var(--line-height-26)] font-medium",
  "focus:border-border-brand focus:ring-border-brand focus:ring-1 focus:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <Text as="span" variant="md-medium" className="text-text-primary">
      {children}
    </Text>
  );
}

export default function PricePredictionForm({ isPending, onSubmit }: PricePredictionFormProps) {
  const [moveType, setMoveType] = useState<PricePredictionMoveType>("HOME");

  const [moveDate, setMoveDate] = useState(today);

  const [loadAmount, setLoadAmount] = useState<PricePredictionLoadAmount>("MEDIUM");

  const [fromAddress, setFromAddress] = useState<AddressItem | null>(null);

  const [toAddress, setToAddress] = useState<AddressItem | null>(null);

  const [addressModalKind, setAddressModalKind] = useState<RegionKind | null>(null);

  const [houseSize, setHouseSize] = useState(24);

  const [fromFloor, setFromFloor] = useState(8);

  const [fromElevator, setFromElevator] = useState(true);

  const [toFloor, setToFloor] = useState(5);

  const [toElevator, setToElevator] = useState(true);

  const [ladderTruck, setLadderTruck] = useState(false);

  const {
    mutate: calculateDistance,
    data: distanceData,
    reset: resetDistance,
    isPending: isDistancePending,
    isError: isDistanceError,
  } = useRouteDistance();

  const distanceKm = distanceData?.distanceKm ?? null;

  useEffect(() => {
    if (!fromAddress || !toAddress) {
      return;
    }

    calculateDistance({
      origin: {
        latitude: fromAddress.latitude,
        longitude: fromAddress.longitude,
      },
      destination: {
        latitude: toAddress.latitude,
        longitude: toAddress.longitude,
      },
    });
  }, [fromAddress, toAddress, calculateDistance]);

  const canSubmit =
    Boolean(fromAddress && toAddress) &&
    distanceKm !== null &&
    !isDistancePending &&
    !isDistanceError &&
    houseSize > 0 &&
    fromFloor > 0 &&
    toFloor > 0 &&
    Boolean(moveDate);

  const handleAddressConfirm = (address: AddressItem) => {
    resetDistance();

    if (addressModalKind === "출발지") {
      setFromAddress(address);
    }

    if (addressModalKind === "도착지") {
      setToAddress(address);
    }

    setAddressModalKind(null);
  };

  const handleFromAddressReset = () => {
    setFromAddress(null);
    resetDistance();
  };

  const handleToAddressReset = () => {
    setToAddress(null);
    resetDistance();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!fromAddress || !toAddress || distanceKm === null) {
      return;
    }

    onSubmit({
      moveType,
      fromRegion: fromAddress.sido,
      toRegion: toAddress.sido,
      distanceKm,
      houseSize,
      loadAmount,
      fromFloor,
      fromElevator,
      toFloor,
      toElevator,
      ladderTruck,
      moveDate,
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-16 border-border-default flex w-full flex-col gap-32 border bg-white p-24 md:p-32"
      >
        {/* 이사 유형 */}
        <div className="flex flex-col gap-16">
          <Text as="h2" variant="lg-semibold" className="text-text-primary">
            이사 유형
          </Text>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {MOVE_TYPES.map((type) => {
              const isSelected = moveType === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setMoveType(type.value)}
                  disabled={isPending}
                  className={cn(
                    "rounded-12 flex h-54 items-center justify-center border transition-colors",
                    isSelected
                      ? "border-border-brand bg-background-brand-muted"
                      : "border-border-default hover:border-border-brand bg-white",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                  )}
                >
                  <Text
                    as="span"
                    variant={isSelected ? "md-semibold" : "md-medium"}
                    className={isSelected ? "text-text-brand" : "text-text-primary"}
                  >
                    {type.label}
                  </Text>
                </button>
              );
            })}
          </div>
        </div>

        {/* 날짜 / 짐량 */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <label className="flex flex-col gap-10">
            <FieldLabel>이사 예정일</FieldLabel>

            <input
              type="date"
              value={moveDate}
              min={today}
              onChange={(event) => setMoveDate(event.target.value)}
              disabled={isPending}
              required
              className={inputClassName}
            />
          </label>

          <label className="flex flex-col gap-10">
            <FieldLabel>짐량</FieldLabel>

            <select
              value={loadAmount}
              onChange={(event) => setLoadAmount(event.target.value as PricePredictionLoadAmount)}
              disabled={isPending}
              className={inputClassName}
            >
              {LOAD_AMOUNTS.map((amount) => (
                <option key={amount.value} value={amount.value}>
                  {amount.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 주소 */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <AddressField
            label="출발지"
            address={fromAddress}
            disabled={isPending || isDistancePending}
            onClick={() => setAddressModalKind("출발지")}
            onReset={handleFromAddressReset}
          />

          <AddressField
            label="도착지"
            address={toAddress}
            disabled={isPending || isDistancePending}
            onClick={() => setAddressModalKind("도착지")}
            onReset={handleToAddressReset}
          />
        </div>

        {/* 이동 거리 */}
        <div className="flex flex-col gap-10">
          <FieldLabel>이동 거리</FieldLabel>

          <div
            className={cn(
              "rounded-12 border-border-default flex min-h-54 items-center border px-20",
              "bg-background-subtle",
            )}
          >
            {isDistancePending ? (
              <div className="flex items-center gap-10">
                <span
                  aria-hidden
                  className="border-border-subtle border-t-border-brand size-18 animate-spin rounded-full border-2"
                />

                <Text as="span" variant="md-medium" className="text-text-subtle">
                  실제 이동 거리를 계산하고 있어요.
                </Text>
              </div>
            ) : isDistanceError && fromAddress && toAddress ? (
              <Text as="span" variant="md-medium" className="text-text-error">
                이동 거리를 계산하지 못했습니다. 주소를 다시 선택해주세요.
              </Text>
            ) : distanceKm !== null ? (
              <div className="flex w-full items-center justify-between gap-12">
                <Text as="span" variant="md-semibold" className="text-text-primary">
                  약 {distanceKm}
                  km
                </Text>

                <Text as="span" variant="xs-regular" className="text-text-subtle">
                  자동차 이동 경로 기준
                </Text>
              </div>
            ) : (
              <Text as="span" variant="md-medium" className="text-text-placeholder">
                출발지와 도착지를 선택하면 자동으로 계산됩니다.
              </Text>
            )}
          </div>
        </div>

        {/* 평수 */}
        <label className="flex flex-col gap-10">
          <FieldLabel>평수</FieldLabel>

          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={300}
              value={houseSize}
              onChange={(event) => setHouseSize(Number(event.target.value))}
              disabled={isPending}
              required
              className={cn(inputClassName, "pr-48")}
            />

            <Text
              as="span"
              variant="md-medium"
              className="text-text-subtle pointer-events-none absolute top-1/2 right-20 -translate-y-1/2"
            >
              평
            </Text>
          </div>
        </label>

        {/* 출발지 조건 */}
        <div className="flex flex-col gap-16">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            출발지 조건
          </Text>

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <FloorInput value={fromFloor} disabled={isPending} onChange={setFromFloor} />

            <BooleanField
              label="엘리베이터"
              value={fromElevator}
              disabled={isPending}
              onChange={setFromElevator}
            />
          </div>
        </div>

        {/* 도착지 조건 */}
        <div className="flex flex-col gap-16">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            도착지 조건
          </Text>

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <FloorInput value={toFloor} disabled={isPending} onChange={setToFloor} />

            <BooleanField
              label="엘리베이터"
              value={toElevator}
              disabled={isPending}
              onChange={setToElevator}
            />
          </div>
        </div>

        {/* 사다리차 */}
        <BooleanField
          label="사다리차"
          value={ladderTruck}
          trueLabel="사용"
          falseLabel="미사용"
          disabled={isPending}
          onChange={setLadderTruck}
        />

        {/* 제출 */}
        <button
          type="submit"
          disabled={!canSubmit || isPending}
          className={cn(
            "rounded-12 bg-background-brand flex h-56 w-full items-center justify-center",
            "hover:bg-background-brand-hover transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <Text as="span" variant="lg-semibold" className="text-text-inverse">
            {isPending
              ? "예상 견적 계산 중..."
              : isDistancePending
                ? "이동 거리 계산 중..."
                : "예상 견적 확인하기"}
          </Text>
        </button>
      </form>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={addressModalKind}
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </>
  );
}

interface AddressFieldProps {
  label: RegionKind;
  address: AddressItem | null;
  disabled: boolean;
  onClick: () => void;
  onReset: () => void;
}

function AddressField({ label, address, disabled, onClick, onReset }: AddressFieldProps) {
  return (
    <div className="flex flex-col gap-10">
      <FieldLabel>{label}</FieldLabel>

      {address ? (
        <div className="flex flex-col gap-8">
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cn(
              "rounded-12 border-border-brand flex min-h-54 w-full items-center border px-20 text-left",
              "hover:bg-background-brand-muted transition-colors",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            <Text as="span" variant="md-medium" className="text-text-brand line-clamp-2">
              {address.roadAddress}
            </Text>
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={disabled}
            className="self-end disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Text
              as="span"
              variant="sm-medium"
              className="text-text-subtle hover:text-text-primary"
            >
              다시 선택
            </Text>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={cn(
            "rounded-12 border-border-brand flex h-54 w-full items-center border px-20",
            "hover:bg-background-brand-muted transition-colors",
            "disabled:cursor-not-allowed disabled:opacity-50",
          )}
        >
          <Text as="span" variant="md-semibold" className="text-text-brand">
            {label} 선택하기
          </Text>
        </button>
      )}
    </div>
  );
}

interface FloorInputProps {
  value: number;
  disabled: boolean;
  onChange: (value: number) => void;
}

function FloorInput({ value, disabled, onChange }: FloorInputProps) {
  return (
    <label className="flex flex-col gap-10">
      <FieldLabel>층수</FieldLabel>

      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          disabled={disabled}
          required
          className={cn(inputClassName, "pr-48")}
        />

        <Text
          as="span"
          variant="md-medium"
          className="text-text-subtle pointer-events-none absolute top-1/2 right-20 -translate-y-1/2"
        >
          층
        </Text>
      </div>
    </label>
  );
}

interface BooleanFieldProps {
  label: string;
  value: boolean;
  disabled: boolean;
  trueLabel?: string;
  falseLabel?: string;
  onChange: (value: boolean) => void;
}

function BooleanField({
  label,
  value,
  disabled,
  trueLabel = "있음",
  falseLabel = "없음",
  onChange,
}: BooleanFieldProps) {
  return (
    <div className="flex flex-col gap-10">
      <FieldLabel>{label}</FieldLabel>

      <div className="grid grid-cols-2 gap-8">
        <BooleanButton selected={!value} disabled={disabled} onClick={() => onChange(false)}>
          {falseLabel}
        </BooleanButton>

        <BooleanButton selected={value} disabled={disabled} onClick={() => onChange(true)}>
          {trueLabel}
        </BooleanButton>
      </div>
    </div>
  );
}

interface BooleanButtonProps {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}

function BooleanButton({ selected, disabled, onClick, children }: BooleanButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-12 h-54 border transition-colors",
        selected
          ? "border-border-brand bg-background-brand-muted"
          : "border-border-default hover:border-border-brand bg-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      <Text
        as="span"
        variant={selected ? "md-semibold" : "md-medium"}
        className={selected ? "text-text-brand" : "text-text-primary"}
      >
        {children}
      </Text>
    </button>
  );
}
