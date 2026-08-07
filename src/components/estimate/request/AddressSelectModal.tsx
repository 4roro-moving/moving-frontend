"use client";

import { useCallback, useState } from "react";

import Modal from "@/components/common/Modal/Modal";
import Search from "@/components/common/Search/Search";
import { Text } from "@/components/common/Text";
import type { AddressSearchItem } from "@/lib/kakao/addressSearch";
import { cn } from "@/lib/utils/cn";

export type AddressItem = AddressSearchItem;

type RegionKind = "출발지" | "도착지";

interface AddressSelectModalProps {
  open: boolean;
  kind: RegionKind;
  onClose: () => void;
  onConfirm: (address: AddressItem) => void;
}

const RESULT_AREA_HEIGHT_CLASS = "h-[280px] max-h-[280px]";

const PANEL_CLASSNAME = cn(
  "items-stretch text-left overflow-hidden",
  "h-auto min-h-[446px] max-h-[90vh] w-full max-w-[292px] gap-0 rounded-24 px-16 py-24",
  "md:h-[620px] md:max-w-[608px] md:rounded-32 md:px-24 md:pt-32 md:pb-40",
);

function AddressChip({ label }: { label: string }) {
  return (
    <span className="bg-background-brand-muted rounded-16 inline-flex w-54 shrink-0 items-center justify-center px-4 py-2">
      <Text as="span" variant="md-semibold" className="text-text-brand">
        {label}
      </Text>
    </span>
  );
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: AddressItem;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-16 flex w-full flex-col items-start gap-16 border px-16 pt-20 pb-24 text-left shadow-[2px_2px_5px_0_rgba(224,224,224,0.20)] transition-colors",
        selected
          ? "border-border-brand bg-background-brand-muted"
          : "border-border-subtle bg-background-surface",
      )}
    >
      {address.zipCode && (
        <Text as="span" variant="lg-semibold" className="text-text-secondary">
          {address.zipCode}
        </Text>
      )}
      <div className="flex w-full flex-col gap-16">
        <div className="flex w-full items-start gap-8">
          <AddressChip label="도로명" />
          <Text as="span" variant="lg-regular" className="text-text-secondary flex-1">
            {address.roadAddress}
          </Text>
        </div>
        {address.jibunAddress && (
          <div className="flex w-full items-center gap-8">
            <AddressChip label="지번" />
            <Text as="span" variant="lg-regular" className="text-text-secondary">
              {address.jibunAddress}
            </Text>
          </div>
        )}
      </div>
    </button>
  );
}

export default function AddressSelectModal({
  open,
  kind,
  onClose,
  onConfirm,
}: AddressSelectModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AddressItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const selected = results.find((item) => item.id === selectedId) ?? null;

  const searchAddress = useCallback(async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setIsSearching(true);
    setErrorMessage(null);
    setSelectedId(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/address/search?query=${encodeURIComponent(trimmed)}`);
      const payload = (await response.json()) as {
        results?: AddressItem[];
        message?: string;
      };

      if (!response.ok) {
        setResults([]);
        setErrorMessage(payload.message || "주소 검색에 실패했습니다.");
        return;
      }

      setResults(payload.results ?? []);
    } catch {
      setResults([]);
      setErrorMessage("주소 검색 중 오류가 발생했습니다.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  function handleSearch() {
    void searchAddress(query);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setSelectedId(null);
    setErrorMessage(null);
    setHasSearched(false);
  }

  return (
    <Modal open={open} onClose={onClose} presentation="modal" size="lg" className={PANEL_CLASSNAME}>
      <div className="mb-30 flex w-full shrink-0 items-center justify-between gap-16 md:mb-40">
        <Modal.Title variant={{ base: "2lg-bold", md: "2xl-semibold" }}>
          {kind}를 선택해주세요
        </Modal.Title>
        <Modal.Close
          size="sm"
          onClose={onClose}
          className="md:size-36"
          iconClassName="md:size-36"
        />
      </div>

      <div className="mb-24 flex min-h-0 w-full flex-col gap-24 overflow-hidden md:mb-40 md:flex-1">
        <form
          className="w-full shrink-0"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
        >
          <Search
            size="responsive"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={handleClear}
            placeholder="주소를 검색해주세요"
            aria-label={`${kind} 주소 검색`}
            className="w-full"
          />
        </form>

        <div className={cn("min-h-0 w-full shrink-0 overflow-y-auto", RESULT_AREA_HEIGHT_CLASS)}>
          {isSearching ? (
            <div className="flex h-full items-center justify-center">
              <Text as="p" variant="md-regular" className="text-text-placeholder">
                주소를 검색하는 중...
              </Text>
            </div>
          ) : errorMessage ? (
            <div className="flex h-full items-center justify-center px-24">
              <Text as="p" variant="md-regular" className="text-text-error text-center">
                {errorMessage}
              </Text>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-16">
              {results.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  selected={selectedId === address.id}
                  onSelect={() => setSelectedId(address.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center px-0 xl:px-24">
              <Text
                as="p"
                variant={{ base: "md-regular", md: "lg-regular" }}
                className="text-text-placeholder text-center"
              >
                {hasSearched
                  ? "검색 결과가 없습니다. 다른 주소로 검색해보세요."
                  : "주소를 검색하면 결과가 여기에 표시됩니다"}
              </Text>
            </div>
          )}
        </div>
      </div>

      <Modal.Button
        fullWidth
        size="cta"
        className="mt-auto md:h-64"
        disabled={!selected}
        onClick={() => {
          if (!selected) return;
          onConfirm(selected);
        }}
      >
        선택 완료
      </Modal.Button>
    </Modal>
  );
}
