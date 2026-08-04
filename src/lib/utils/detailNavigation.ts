"use client";

const INTERNAL_DETAIL_ENTRY_STORAGE_KEY = "moving:internal-detail-entry";

interface NavigationClickEventLike {
  altKey?: boolean;
  button?: number;
  ctrlKey?: boolean;
  defaultPrevented?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

function readInternalDetailNavigation(): string | null {
  try {
    return sessionStorage.getItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearStoredInternalDetailNavigation(pathname?: string) {
  try {
    const currentPathname = sessionStorage.getItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY);

    if (!currentPathname) {
      return;
    }

    if (pathname && currentPathname !== pathname) {
      return;
    }

    sessionStorage.removeItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function markInternalDetailNavigation(pathname: string) {
  try {
    sessionStorage.setItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY, pathname);
  } catch {
    // ignore
  }
}

export function markInternalDetailNavigationOnClick(
  event: NavigationClickEventLike,
  pathname: string,
) {
  if (
    event.defaultPrevented ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (typeof event.button === "number" && event.button !== 0)
  ) {
    return;
  }

  markInternalDetailNavigation(pathname);
}

export function consumeInternalDetailNavigation(pathname: string): boolean {
  const pendingPathname = readInternalDetailNavigation();

  if (pendingPathname === pathname) {
    clearStoredInternalDetailNavigation(pathname);
    return true;
  }

  if (pendingPathname) {
    clearStoredInternalDetailNavigation();
  }

  return false;
}

export function clearInternalDetailNavigation(pathname: string) {
  clearStoredInternalDetailNavigation(pathname);
}
