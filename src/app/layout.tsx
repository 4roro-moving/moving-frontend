import type { Metadata } from "next";
import type { ReactNode } from "react";

import QueryProvider from "@/providers/QueryProvider";

import "./globals.css";

export const metadata: Metadata = {
  title: "moving-frontend",
  description: "이사 서비스 프론트엔드",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
