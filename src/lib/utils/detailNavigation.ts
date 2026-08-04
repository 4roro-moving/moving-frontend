"use client";

const INTERNAL_DETAIL_ENTRY_STORAGE_KEY = "moving:internal-detail-entries";

type InternalDetailEntryMap = Record<string, true>;

function readInternalDetailEntries(): InternalDetailEntryMap {
  try {
    const raw = sessionStorage.getItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.entries(parsed).reduce<InternalDetailEntryMap>((entries, [pathname, value]) => {
      if (value === true) {
        entries[pathname] = true;
      }

      return entries;
    }, {});
  } catch {
    return {};
  }
}

function writeInternalDetailEntries(entries: InternalDetailEntryMap) {
  try {
    const nextEntries = Object.keys(entries);

    if (nextEntries.length === 0) {
      sessionStorage.removeItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY);
      return;
    }

    sessionStorage.setItem(INTERNAL_DETAIL_ENTRY_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function markInternalDetailNavigation(pathname: string) {
  const entries = readInternalDetailEntries();

  entries[pathname] = true;
  writeInternalDetailEntries(entries);
}

export function hasInternalDetailNavigation(pathname: string): boolean {
  const entries = readInternalDetailEntries();

  return entries[pathname] === true;
}

export function clearInternalDetailNavigation(pathname: string) {
  const entries = readInternalDetailEntries();

  if (!(pathname in entries)) {
    return;
  }

  delete entries[pathname];
  writeInternalDetailEntries(entries);
}
