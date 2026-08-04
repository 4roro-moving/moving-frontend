"use client";

const INTERNAL_DETAIL_ENTRY_PENDING_STORAGE_KEY = "moving:internal-detail-entry-pending";
const INTERNAL_DETAIL_ENTRY_HISTORY_STATE_KEY = "__movingInternalDetailEntryPath";

interface NavigationClickEventLike {
  altKey?: boolean;
  button?: number;
  ctrlKey?: boolean;
  defaultPrevented?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
}

function readPendingInternalDetailNavigation(): string | null {
  try {
    return sessionStorage.getItem(INTERNAL_DETAIL_ENTRY_PENDING_STORAGE_KEY);
  } catch {
    return null;
  }
}

function clearPendingInternalDetailNavigation(pathname?: string) {
  try {
    const pendingPathname = sessionStorage.getItem(INTERNAL_DETAIL_ENTRY_PENDING_STORAGE_KEY);

    if (!pendingPathname) {
      return;
    }

    if (pathname && pendingPathname !== pathname) {
      return;
    }

    sessionStorage.removeItem(INTERNAL_DETAIL_ENTRY_PENDING_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function replaceInternalDetailHistoryState(pathname: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  const currentState =
    window.history.state && typeof window.history.state === "object"
      ? (window.history.state as Record<string, unknown>)
      : {};

  const nextState = { ...currentState };

  if (pathname) {
    nextState[INTERNAL_DETAIL_ENTRY_HISTORY_STATE_KEY] = pathname;
  } else {
    delete nextState[INTERNAL_DETAIL_ENTRY_HISTORY_STATE_KEY];
  }

  window.history.replaceState(nextState, "", window.location.href);
}

function readInternalDetailHistoryState(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const state = window.history.state;

  if (!state || typeof state !== "object") {
    return null;
  }

  const pathname = (state as Record<string, unknown>)[INTERNAL_DETAIL_ENTRY_HISTORY_STATE_KEY];

  return typeof pathname === "string" ? pathname : null;
}

export function markInternalDetailNavigation(pathname: string) {
  try {
    sessionStorage.setItem(INTERNAL_DETAIL_ENTRY_PENDING_STORAGE_KEY, pathname);
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

export function activateInternalDetailNavigation(pathname: string): boolean {
  const pendingPathname = readPendingInternalDetailNavigation();

  if (pendingPathname === pathname) {
    clearPendingInternalDetailNavigation(pathname);
    replaceInternalDetailHistoryState(pathname);
    return true;
  }

  if (pendingPathname) {
    clearPendingInternalDetailNavigation();
  }

  return readInternalDetailHistoryState() === pathname;
}

export function clearInternalDetailNavigation(pathname: string) {
  clearPendingInternalDetailNavigation(pathname);

  if (readInternalDetailHistoryState() === pathname) {
    replaceInternalDetailHistoryState(null);
  }
}
