"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { LoginRequiredModal } from "@/components/auth/LoginRequiredModal";

interface LoginRequiredModalContextValue {
  openLoginRequiredModal: () => void;
}

const LoginRequiredModalContext = createContext<LoginRequiredModalContextValue | null>(null);

interface LoginRequiredModalProviderProps {
  children: ReactNode;
}

/** 비회원이 찜 등 인증 액션에 닿을 수 있는 라우트(기사님 찾기)에만 감싼다. */
export function LoginRequiredModalProvider({ children }: LoginRequiredModalProviderProps) {
  const [open, setOpen] = useState(false);

  const openLoginRequiredModal = useCallback(() => {
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      openLoginRequiredModal,
    }),
    [openLoginRequiredModal],
  );

  return (
    <LoginRequiredModalContext.Provider value={value}>
      {children}
      <LoginRequiredModal open={open} onClose={() => setOpen(false)} />
    </LoginRequiredModalContext.Provider>
  );
}

/** Provider 밖이면 null — 로그인 필수 화면 등에서는 모달이 필요 없음 */
export function useLoginRequiredModal(): LoginRequiredModalContextValue | null {
  return useContext(LoginRequiredModalContext);
}
