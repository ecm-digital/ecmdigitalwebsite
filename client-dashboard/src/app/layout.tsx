import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import ClientWrapper from "@/components/layout/client-wrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Panel Klienta - ECM Digital",
  description: "Dashboard do zarządzania projektami ECM Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hubspotPortalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "145940599";
  const hubspotCluster = process.env.NEXT_PUBLIC_HUBSPOT_CLUSTER || "eu1";
  return (
    <html lang="pl" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} dark font-display`}>
        <div className="min-h-screen bg-black">
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </div>
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
