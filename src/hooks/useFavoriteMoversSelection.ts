"use client";

import { useTranslations } from "next-intl";

import { useCallback, useMemo, useState } from "react";

import { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";
import { MAX_BULK_FAVORITE_MOVERS } from "@/lib/api/favorites";

interface UseFavoriteMoversSelectionOptions {
  loadedIds: string[];
  totalCount: number;
}

/** 찜한 기사님 목록 페이지의 선택·일괄 삭제 상태 */
export function useFavoriteMoversSelection({
  loadedIds,
  totalCount,
}: UseFavoriteMoversSelectionOptions) {
  const t = useTranslations("favorites");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** 화면에 안 보이는 찜까지 포함해 전체를 고른 상태 */
  const [isSelectAll, setIsSelectAll] = useState(false);
  /** 전체선택 상태에서 개별 해제한 id — “전체에서 이 사람만 제외” */
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  /** 확인 모달 문구용 — 낙관적 업데이트로 totalCount가 0이 되어도 고정 */
  const [deleteConfirmCount, setDeleteConfirmCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { mutateAsync: bulkRemove, isPending: isBulkDeleting } = useBulkRemoveFavoriteMovers({
    onError: setToastMessage,
  });

  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const excludedIdSet = useMemo(() => new Set(excludedIds), [excludedIds]);
  const selectedOnLoadedCount = loadedIds.filter((id) => selectedIdSet.has(id)).length;
  const selectedCount = isSelectAll
    ? Math.max(0, totalCount - excludedIds.length)
    : selectedOnLoadedCount;
  const isAllSelected = isSelectAll
    ? excludedIds.length === 0
    : totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setExcludedIds([]);
    setIsSelectAll(false);
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setIsSelectAll(true);
        setExcludedIds([]);
        setSelectedIds(loadedIds);
        return;
      }
      setSelectedIds([]);
      setExcludedIds([]);
      setIsSelectAll(false);
    },
    [loadedIds],
  );

  const handleToggleMover = useCallback(
    (moverId: string, checked: boolean) => {
      if (isSelectAll) {
        if (
          !checked &&
          !excludedIdSet.has(moverId) &&
          excludedIds.length >= MAX_BULK_FAVORITE_MOVERS
        ) {
          setToastMessage(t("maxExclusion", { count: MAX_BULK_FAVORITE_MOVERS }));
          return;
        }

        setExcludedIds((prev) => {
          if (checked) {
            return prev.filter((id) => id !== moverId);
          }
          return prev.includes(moverId) ? prev : [...prev, moverId];
        });
        return;
      }

      if (
        checked &&
        !selectedIdSet.has(moverId) &&
        selectedIds.length >= MAX_BULK_FAVORITE_MOVERS
      ) {
        setToastMessage(t("maxSelection", { count: MAX_BULK_FAVORITE_MOVERS }));
        return;
      }

      setSelectedIds((prev) => {
        if (checked) {
          return prev.includes(moverId) ? prev : [...prev, moverId];
        }
        return prev.filter((id) => id !== moverId);
      });
    },
    [excludedIdSet, excludedIds.length, isSelectAll, selectedIdSet, selectedIds.length, t],
  );

  const removeFavoritesByIds = useCallback(
    async (idsToRemove: string[]) => {
      if (idsToRemove.length === 0) {
        return;
      }

      await bulkRemove({
        mode: "ids",
        moverIds: idsToRemove,
      });

      clearSelection();
    },
    [bulkRemove, clearSelection],
  );

  const removeFavoritesAll = useCallback(
    async (excluded: string[]) => {
      await bulkRemove({
        mode: "all",
        excludedIds: excluded,
      });

      clearSelection();
    },
    [bulkRemove, clearSelection],
  );

  const handleBulkDelete = useCallback(() => {
    if (!hasSelection || isBulkDeleting) {
      return;
    }

    // 전체선택(일부 제외 포함)이거나 개별 선택 수가 현재 전체 수와 같으면 확인 모달
    if (isSelectAll || selectedCount === totalCount) {
      setDeleteConfirmCount(selectedCount);
      setIsDeleteConfirmOpen(true);
      return;
    }

    void (async () => {
      try {
        await removeFavoritesByIds([...selectedIds]);
      } catch {
        // 전부 실패 시 useBulkRemoveFavoriteMovers onError에서 토스트 처리
      }
    })();
  }, [
    hasSelection,
    isBulkDeleting,
    isSelectAll,
    selectedCount,
    totalCount,
    removeFavoritesByIds,
    selectedIds,
  ]);

  const handleConfirmDeleteAll = useCallback(() => {
    void (async () => {
      try {
        if (isSelectAll) {
          await removeFavoritesAll(excludedIds);
        } else {
          await removeFavoritesByIds([...selectedIds]);
        }
        setIsDeleteConfirmOpen(false);
      } catch {
        // 전부 실패 시 mutation onError에서 토스트 처리. 모달은 재시도 가능하도록 유지
      }
    })();
  }, [excludedIds, isSelectAll, removeFavoritesAll, removeFavoritesByIds, selectedIds]);

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!isBulkDeleting) {
      setIsDeleteConfirmOpen(false);
    }
  }, [isBulkDeleting]);

  const isMoverSelected = useCallback(
    (moverId: string) => (isSelectAll ? !excludedIdSet.has(moverId) : selectedIdSet.has(moverId)),
    [excludedIdSet, isSelectAll, selectedIdSet],
  );

  return {
    selectedCount,
    isAllSelected,
    isBulkDeleting,
    isDeleteConfirmOpen,
    deleteConfirmCount,
    toastMessage,
    setToastMessage,
    handleSelectAll,
    handleToggleMover,
    handleBulkDelete,
    handleConfirmDeleteAll,
    handleCloseDeleteConfirm,
    isMoverSelected,
  };
}
