import type { Metadata, Viewport } from "next";
import { Inter, Aboreto } from "next/font/google";
import "./globals.css";
import ScrollProvider from "@/hooks/ScrollProvider";
import ScrollToTop from "@/components/ScrollToTop";
import Cursor from "@/components/Cursor";

// Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Aboreto
const aboreto = Aboreto({
  variable: "--font-aboreto",
  subsets: ["latin"],
  weight: "400", // Aboreto only has one weight
  display: "swap",
});

export const metadata: Metadata = {
  title: "Signsol Design",
  description: "High-impact signage solutions",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
  viewportFit: "cover",
};

import { PageTransitionProvider } from "@/components/PageTransition";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${aboreto.variable} antialiased overflow-x-hidden lg:cursor-none`}>
        <Suspense fallback={null}>
          <PageTransitionProvider>
            <ScrollProvider>
              <Cursor />
              {children}
              <ScrollToTop />
            </ScrollProvider>
          </PageTransitionProvider>
        </Suspense>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
