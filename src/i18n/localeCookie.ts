"use client";

import { LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function setLocaleCookie(locale: Locale): void {
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${LOCALE_COOKIE_NAME}=${encodeURIComponent(locale)}; Path=/; SameSite=Lax; Max-Age=${ONE_YEAR_SECONDS}${secureFlag}`;
}
