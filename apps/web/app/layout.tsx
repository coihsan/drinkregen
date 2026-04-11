import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import type { Metadata } from 'next'
import { WebVitals } from "@/components/web-vitals";
 
export const metadata: Metadata = {
  title: 'Regen | Asli Nol Kalori',
  description: '...',
}

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <WebVitals />
        <main>
          <SiteHeader />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
