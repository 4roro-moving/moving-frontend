"use client";

import { useState } from "react";

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
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  /** 확인 모달 문구용 — 낙관적 업데이트로 totalCount가 0이 되어도 고정 */
  const [deleteConfirmCount, setDeleteConfirmCount] = useState(0);
  const [isResolvingAllIds, setIsResolvingAllIds] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bulkRemoveMutation = useBulkRemoveFavoriteMovers({ onError: setToastMessage });

  const selectedOnLoadedCount = loadedIds.filter((id) => selectedIds.includes(id)).length;
  const selectedCount = isSelectAll ? totalCount : selectedOnLoadedCount;
  const isAllSelected = isSelectAll || (totalCount > 0 && selectedCount === totalCount);
  const hasSelection = selectedCount > 0;
  const isBulkDeleting = bulkRemoveMutation.isPending || isResolvingAllIds;

  const clearSelection = () => {
    setSelectedIds([]);
    setIsSelectAll(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setIsSelectAll(true);
      setSelectedIds(loadedIds);
      return;
    }
    clearSelection();
  };

  const handleToggleMover = (moverId: string, checked: boolean) => {
    if (isSelectAll) {
      if (checked) {
        return;
      }
      setIsSelectAll(false);
      setSelectedIds(loadedIds.filter((id) => id !== moverId));
      return;
    }

    setSelectedIds((prev) => {
      if (checked) {
        return prev.includes(moverId) ? prev : [...prev, moverId];
      }
      return prev.filter((id) => id !== moverId);
    });
  };

  const removeFavorites = async (idsToRemove: string[]) => {
    if (idsToRemove.length === 0) {
      return;
    }

    const result = await bulkRemoveMutation.mutateAsync(idsToRemove);

    if (result.failedIds.length > 0) {
      setIsSelectAll(false);
      setSelectedIds(result.failedIds);
      return;
    }

    clearSelection();
  };

  const handleBulkDelete = () => {
    if (!hasSelection || isBulkDeleting) {
      return;
    }

    if (isSelectAll || selectedCount === totalCount) {
      setDeleteConfirmCount(totalCount);
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
  };

  const handleConfirmDeleteAll = () => {
    void (async () => {
      setIsResolvingAllIds(true);
      try {
        const allIds = await fetchAllFavoriteMoverIds();
        try {
          await removeFavorites(allIds);
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
  };

  const handleCloseDeleteConfirm = () => {
    if (!isBulkDeleting) {
      setIsDeleteConfirmOpen(false);
    }
  };

  const isMoverSelected = (moverId: string) => isSelectAll || selectedIds.includes(moverId);

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
