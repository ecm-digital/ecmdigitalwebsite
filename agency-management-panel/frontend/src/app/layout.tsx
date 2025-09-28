import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ECM Digital - Panel Zarządzania",
  description: "Panel zarządzania agencją ECM Digital",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  )
}
