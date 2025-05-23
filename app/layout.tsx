import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { AuthProvider } from "@/components/auth-provider"
import { Providers } from "@/app/Providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Grievance Portal",
  description: "A playful grievance submission portal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
          <AuthProvider>
            <Providers>{children}</Providers>
          </AuthProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
