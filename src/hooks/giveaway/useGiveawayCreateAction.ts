"use client";

import { useCallback, useState } from "react";

export const useGiveawayCreateAction = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const openCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const closeCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  return {
    isCreateOpen,
    openCreate,
    closeCreate,
  };
};
