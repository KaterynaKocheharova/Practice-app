import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getCurrentUserServer } from "@/modules/auth/api/current-user-server";
import { Header } from "@/modules/common/components";
import { TEXTS } from "@/modules/common/constants";
import { AppProviders } from "./providers";
import { rootLayoutStyles } from "./style";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: TEXTS.METADATA.TITLE,
  description: TEXTS.METADATA.DESCRIPTION,
};

const RootLayout = async ({ children }: RootLayoutProps) => {
  const currentUser = await getCurrentUserServer();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${rootLayoutStyles.htmlTheme}`}
    >
      <body className={rootLayoutStyles.body}>
        <AppProviders>
          <Header initialUser={currentUser} />
          {children}
        </AppProviders>
      </body>
    </html>
  );
};

export default RootLayout;
