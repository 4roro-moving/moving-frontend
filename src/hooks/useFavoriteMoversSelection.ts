"use client";

import { useCallback, useState } from "react";

import { useBulkRemoveFavoriteMovers } from "@/hooks/useBulkRemoveFavoriteMovers";
import { fetchAllFavoriteMoverIds } from "@/lib/api/favorites";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

const DELETE_ERROR_MESSAGE = "선택한 기사님을 삭제하지 못했습니다. 잠시 후 다시 시도해주세요.";

interface UseFavoriteMoversSelectionOptions {
  loadedIds: string[];
  totalCount: number;
}

/** 찜한 기사님 목록 페이지의 선택·일괄 삭제 상태 */
export function useFavoriteMoversSelection({
  loadedIds,
  totalCount,
}: UseFavoriteMoversSelectionOptions) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  /** 화면에 안 보이는 찜까지 포함해 전체를 고른 상태 */
  const [isSelectAll, setIsSelectAll] = useState(false);
  /** 전체선택 상태에서 개별 해제한 id — “전체에서 이 사람만 제외” */
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  /** 확인 모달 문구용 — 낙관적 업데이트로 totalCount가 0이 되어도 고정 */
  const [deleteConfirmCount, setDeleteConfirmCount] = useState(0);
  const [isResolvingAllIds, setIsResolvingAllIds] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bulkRemoveMutation = useBulkRemoveFavoriteMovers({ onError: setToastMessage });

  const selectedOnLoadedCount = loadedIds.filter((id) => selectedIds.includes(id)).length;
  const selectedCount = isSelectAll
    ? Math.max(0, totalCount - excludedIds.length)
    : selectedOnLoadedCount;
  const isAllSelected = isSelectAll
    ? excludedIds.length === 0
    : totalCount > 0 && selectedCount === totalCount;
  const hasSelection = selectedCount > 0;
  const isBulkDeleting = bulkRemoveMutation.isPending || isResolvingAllIds;

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
        setExcludedIds((prev) => {
          if (checked) {
            return prev.filter((id) => id !== moverId);
          }
          return prev.includes(moverId) ? prev : [...prev, moverId];
        });
        return;
      }

      setSelectedIds((prev) => {
        if (checked) {
          return prev.includes(moverId) ? prev : [...prev, moverId];
        }
        return prev.filter((id) => id !== moverId);
      });
    },
    [isSelectAll],
  );

  const removeFavorites = useCallback(
    async (idsToRemove: string[]) => {
      if (idsToRemove.length === 0) {
        return;
      }

      const result = await bulkRemoveMutation.mutateAsync(idsToRemove);

      if (result.failedIds.length > 0) {
        setIsSelectAll(false);
        setExcludedIds([]);
        setSelectedIds(result.failedIds);
        return;
      }

      clearSelection();
    },
    [bulkRemoveMutation, clearSelection],
  );

  const handleBulkDelete = useCallback(() => {
    if (!hasSelection || isBulkDeleting) {
      return;
    }

    // 전체선택(일부 제외 포함)이거나, 로드된 전체가 곧 전체 찜인 경우 → 확인 모달
    if (isSelectAll || selectedCount === totalCount) {
      setDeleteConfirmCount(selectedCount);
      setIsDeleteConfirmOpen(true);
      return;
    }

    void (async () => {
      try {
        await removeFavorites([...selectedIds]);
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
    removeFavorites,
    selectedIds,
  ]);

  const handleConfirmDeleteAll = useCallback(() => {
    void (async () => {
      setIsResolvingAllIds(true);
      try {
        const allIds = await fetchAllFavoriteMoverIds();
        const excludedSet = new Set(excludedIds);
        const idsToRemove = isSelectAll ? allIds.filter((id) => !excludedSet.has(id)) : allIds;

        try {
          await removeFavorites(idsToRemove);
          setIsDeleteConfirmOpen(false);
        } catch {
          // 전부 실패 시 mutation onError에서 토스트 처리. 모달은 재시도 가능하도록 유지
        }
      } catch (error) {
        setToastMessage(getApiErrorMessage(error, DELETE_ERROR_MESSAGE));
      } finally {
        setIsResolvingAllIds(false);
      }
    })();
  }, [excludedIds, isSelectAll, removeFavorites]);

  const handleCloseDeleteConfirm = useCallback(() => {
    if (!isBulkDeleting) {
      setIsDeleteConfirmOpen(false);
    }
  }, [isBulkDeleting]);

  const isMoverSelected = useCallback(
    (moverId: string) =>
      isSelectAll ? !excludedIds.includes(moverId) : selectedIds.includes(moverId),
    [excludedIds, isSelectAll, selectedIds],
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
