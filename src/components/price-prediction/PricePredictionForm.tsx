"use client";

import { useTranslations } from "next-intl";
import { useEffect, useEffectEvent, useId, useState, type FormEvent, type ReactNode } from "react";

import { Text } from "@/components/common/Text";
import AddressSelectModal, {
  type AddressItem,
} from "@/components/estimate/request/AddressSelectModal";
import { useRouteDistance } from "@/hooks/useRouteDistance";
import { ADDRESS_DIRECTION, type AddressDirection } from "@/lib/constants/address";
import { MOVE_TYPE_VALUES } from "@/lib/constants/moveType";
import { cn } from "@/lib/utils/cn";
import { formatDateToKstISODate } from "@/lib/utils/date";
import type {
  PricePredictionLoadAmount,
  PricePredictionMoveType,
  PricePredictionRequest,
} from "@/types/pricePrediction";

interface PricePredictionFormProps {
  isPending: boolean;
  onSubmit: (data: PricePredictionRequest) => void;
}

const LOAD_AMOUNTS: PricePredictionLoadAmount[] = ["LOW", "MEDIUM", "HIGH"];

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

function parseNumberInput(value: string): number | "" {
  if (value === "") {
    return "";
  }

  const numberValue = Number(value);

  return Number.isFinite(numberValue) ? numberValue : "";
}

function hasSameCoordinates(current: AddressItem | null, next: AddressItem): boolean {
  return (
    current !== null && current.latitude === next.latitude && current.longitude === next.longitude
  );
}

export default function PricePredictionForm({ isPending, onSubmit }: PricePredictionFormProps) {
  const t = useTranslations("pricePrediction");
  const [today, setToday] = useState(() => formatDateToKstISODate(new Date()));

  const [moveType, setMoveType] = useState<PricePredictionMoveType>("HOME");

  const [moveDate, setMoveDate] = useState(today);

  const [loadAmount, setLoadAmount] = useState<PricePredictionLoadAmount>("MEDIUM");

  const [fromAddress, setFromAddress] = useState<AddressItem | null>(null);

  const [toAddress, setToAddress] = useState<AddressItem | null>(null);

  const [addressModalKind, setAddressModalKind] = useState<AddressDirection | null>(null);

  const [houseSize, setHouseSize] = useState<number | "">(24);

  const [fromFloor, setFromFloor] = useState<number | "">(8);

  const [fromElevator, setFromElevator] = useState(true);

  const [toFloor, setToFloor] = useState<number | "">(5);

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
  const fromLatitude = fromAddress?.latitude;
  const fromLongitude = fromAddress?.longitude;
  const toLatitude = toAddress?.latitude;
  const toLongitude = toAddress?.longitude;

  const requestRouteDistance = useEffectEvent(
    (
      originLatitude: number,
      originLongitude: number,
      destinationLatitude: number,
      destinationLongitude: number,
    ) => {
      calculateDistance({
        origin: {
          latitude: originLatitude,
          longitude: originLongitude,
        },
        destination: {
          latitude: destinationLatitude,
          longitude: destinationLongitude,
        },
      });
    },
  );

  useEffect(() => {
    const syncKstToday = () => {
      const nextToday = formatDateToKstISODate(new Date());

      setToday((currentToday) => (currentToday === nextToday ? currentToday : nextToday));
      setMoveDate((currentMoveDate) => (currentMoveDate < nextToday ? nextToday : currentMoveDate));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncKstToday();
      }
    };

    window.addEventListener("focus", syncKstToday);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", syncKstToday);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (
      fromLatitude === undefined ||
      fromLongitude === undefined ||
      toLatitude === undefined ||
      toLongitude === undefined
    ) {
      return;
    }

    requestRouteDistance(fromLatitude, fromLongitude, toLatitude, toLongitude);
  }, [fromLatitude, fromLongitude, toLatitude, toLongitude]);

  const canSubmit =
    Boolean(fromAddress && toAddress) &&
    distanceKm !== null &&
    !isDistancePending &&
    !isDistanceError &&
    typeof houseSize === "number" &&
    houseSize > 0 &&
    typeof fromFloor === "number" &&
    fromFloor > 0 &&
    typeof toFloor === "number" &&
    toFloor > 0 &&
    Boolean(moveDate);

  const handleAddressConfirm = (address: AddressItem) => {
    if (!addressModalKind) {
      return;
    }

    const currentAddress = addressModalKind === ADDRESS_DIRECTION.FROM ? fromAddress : toAddress;

    if (hasSameCoordinates(currentAddress, address)) {
      setAddressModalKind(null);
      return;
    }

    resetDistance();

    if (addressModalKind === ADDRESS_DIRECTION.FROM) {
      setFromAddress(address);
    }

    if (addressModalKind === ADDRESS_DIRECTION.TO) {
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

    if (
      !canSubmit ||
      isPending ||
      !fromAddress ||
      !toAddress ||
      distanceKm === null ||
      typeof houseSize !== "number" ||
      typeof fromFloor !== "number" ||
      typeof toFloor !== "number"
    ) {
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
            {t("form.moveType")}
          </Text>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
            {MOVE_TYPE_VALUES.map((type) => {
              const isSelected = moveType === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMoveType(type)}
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
                    {t(`moveTypes.${type}`)}
                  </Text>
                </button>
              );
            })}
          </div>
        </div>

        {/* 날짜 / 짐량 */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <label className="flex flex-col gap-10">
            <FieldLabel>{t("form.moveDate")}</FieldLabel>

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
            <FieldLabel>{t("form.loadAmount")}</FieldLabel>

            <select
              value={loadAmount}
              onChange={(event) => setLoadAmount(event.target.value as PricePredictionLoadAmount)}
              disabled={isPending}
              className={inputClassName}
            >
              {LOAD_AMOUNTS.map((amount) => (
                <option key={amount} value={amount}>
                  {t(`loadAmounts.${amount}`)}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 주소 */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
          <AddressField
            label={t("form.origin")}
            address={fromAddress}
            disabled={isPending || isDistancePending}
            onClick={() => setAddressModalKind(ADDRESS_DIRECTION.FROM)}
            onReset={handleFromAddressReset}
          />

          <AddressField
            label={t("form.destination")}
            address={toAddress}
            disabled={isPending || isDistancePending}
            onClick={() => setAddressModalKind(ADDRESS_DIRECTION.TO)}
            onReset={handleToAddressReset}
          />
        </div>

        {/* 이동 거리 */}
        <div className="flex flex-col gap-10">
          <FieldLabel>{t("form.distance")}</FieldLabel>

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
                  {t("form.distanceCalculating")}
                </Text>
              </div>
            ) : isDistanceError && fromAddress && toAddress ? (
              <Text as="span" variant="md-medium" className="text-text-error">
                {t("form.distanceError")}
              </Text>
            ) : distanceKm !== null ? (
              <div className="flex w-full items-center justify-between gap-12">
                <Text as="span" variant="md-semibold" className="text-text-primary">
                  {t("form.distanceValue", { distance: distanceKm })}
                </Text>

                <Text as="span" variant="xs-regular" className="text-text-subtle">
                  {t("form.drivingRoute")}
                </Text>
              </div>
            ) : (
              <Text as="span" variant="md-medium" className="text-text-placeholder">
                {t("form.distancePlaceholder")}
              </Text>
            )}
          </div>
        </div>

        {/* 평수 */}
        <label className="flex flex-col gap-10">
          <FieldLabel>{t("form.houseSize")}</FieldLabel>

          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={300}
              value={houseSize}
              onChange={(event) => setHouseSize(parseNumberInput(event.target.value))}
              disabled={isPending}
              required
              className={cn(inputClassName, "pr-48")}
            />

            <Text
              as="span"
              variant="md-medium"
              className="text-text-subtle pointer-events-none absolute top-1/2 right-20 -translate-y-1/2"
            >
              {t("form.pyeongUnit")}
            </Text>
          </div>
        </label>

        {/* 출발지 조건 */}
        <div className="flex flex-col gap-16">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            {t("form.originConditions")}
          </Text>

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <FloorInput value={fromFloor} disabled={isPending} onChange={setFromFloor} />

            <BooleanField
              label={t("form.elevator")}
              value={fromElevator}
              disabled={isPending}
              onChange={setFromElevator}
            />
          </div>
        </div>

        {/* 도착지 조건 */}
        <div className="flex flex-col gap-16">
          <Text as="h3" variant="lg-semibold" className="text-text-primary">
            {t("form.destinationConditions")}
          </Text>

          <div className="grid grid-cols-1 gap-20 md:grid-cols-2">
            <FloorInput value={toFloor} disabled={isPending} onChange={setToFloor} />

            <BooleanField
              label={t("form.elevator")}
              value={toElevator}
              disabled={isPending}
              onChange={setToElevator}
            />
          </div>
        </div>

        {/* 사다리차 */}
        <BooleanField
          label={t("form.ladderTruck")}
          value={ladderTruck}
          trueLabel={t("form.use")}
          falseLabel={t("form.notUse")}
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
              ? t("form.predicting")
              : isDistancePending
                ? t("form.distanceCalculatingShort")
                : t("form.submit")}
          </Text>
        </button>
      </form>

      {addressModalKind && (
        <AddressSelectModal
          open
          kind={
            addressModalKind === ADDRESS_DIRECTION.FROM ? t("form.origin") : t("form.destination")
          }
          onClose={() => setAddressModalKind(null)}
          onConfirm={handleAddressConfirm}
        />
      )}
    </>
  );
}

interface AddressFieldProps {
  label: string;
  address: AddressItem | null;
  disabled: boolean;
  onClick: () => void;
  onReset: () => void;
}

function AddressField({ label, address, disabled, onClick, onReset }: AddressFieldProps) {
  const t = useTranslations("pricePrediction");

  return (
    <div className="flex flex-col gap-10">
      <FieldLabel>{label}</FieldLabel>

      {address ? (
        <div className="flex flex-col gap-8">
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={t("form.changeAddressAria", { label, address: address.roadAddress })}
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
            aria-label={t("form.reselectAddressAria", { label })}
            className="self-end disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Text
              as="span"
              variant="sm-medium"
              className="text-text-subtle hover:text-text-primary"
            >
              {t("form.reselect")}
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
            {t("form.selectAddress", { label })}
          </Text>
        </button>
      )}
    </div>
  );
}

interface FloorInputProps {
  value: number | "";
  disabled: boolean;
  onChange: (value: number | "") => void;
}

function FloorInput({ value, disabled, onChange }: FloorInputProps) {
  const t = useTranslations("pricePrediction");

  return (
    <label className="flex flex-col gap-10">
      <FieldLabel>{t("form.floor")}</FieldLabel>

      <div className="relative">
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={100}
          value={value}
          onChange={(event) => onChange(parseNumberInput(event.target.value))}
          disabled={disabled}
          required
          className={cn(inputClassName, "pr-48")}
        />

        <Text
          as="span"
          variant="md-medium"
          className="text-text-subtle pointer-events-none absolute top-1/2 right-20 -translate-y-1/2"
        >
          {t("form.floorUnit")}
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
  trueLabel,
  falseLabel,
  onChange,
}: BooleanFieldProps) {
  const t = useTranslations("pricePrediction");
  const groupLabelId = useId();
  const resolvedTrueLabel = trueLabel ?? t("form.yes");
  const resolvedFalseLabel = falseLabel ?? t("form.no");

  return (
    <div className="flex flex-col gap-10">
      <span id={groupLabelId}>
        <FieldLabel>{label}</FieldLabel>
      </span>

      <div role="radiogroup" aria-labelledby={groupLabelId} className="grid grid-cols-2 gap-8">
        <BooleanButton selected={!value} disabled={disabled} onClick={() => onChange(false)}>
          {resolvedFalseLabel}
        </BooleanButton>

        <BooleanButton selected={value} disabled={disabled} onClick={() => onChange(true)}>
          {resolvedTrueLabel}
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
      role="radio"
      aria-checked={selected}
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
