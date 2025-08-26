import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ECM Digital management",
  description: "ECM Digital management panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "145940599";
  const hubspotCluster = process.env.NEXT_PUBLIC_HUBSPOT_CLUSTER || "eu1"; // eu1 per provided embed
  return (
    <html lang="pl" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          <DashboardHeader />
          {children}
        </Providers>
        <Toaster richColors position="top-right" />
        {hubspotPortalId ? (
          <Script
            id="hs-script-loader"
            strategy="afterInteractive"
            src={`https://js-${hubspotCluster}.hs-scripts.com/${hubspotPortalId}.js`}
          />
        ) : null}
      </body>
    </html>
  );
}
