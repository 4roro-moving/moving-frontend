"use client";

import { type ReactNode } from "react";

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/Header/Header";
import { AppProviders } from "@/providers/AppProviders";

import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <AppProviders>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
