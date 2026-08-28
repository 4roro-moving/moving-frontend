"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** pathname이 바뀌면 최신 닫기 콜백 실행. 최초 마운트 시에는 실행하지 않음. */
export function useCloseOnPathnameChange(onClose?: () => void): void {
  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (initialPathnameRef.current === pathname) return;

    initialPathnameRef.current = pathname;
    onCloseRef.current?.();
  }, [pathname]);
}
