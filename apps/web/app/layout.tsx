import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { WebVitals } from "@/components/web-vitals";
import Script from "next/script";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { getLatestInstagramPosts } from "@/lib/instagram";
import InstagramPostSlider from "@/components/instagram-post-slider";

export const metadata: Metadata = {
  title: "Regen | Asli Nol Kalori",
  description: "...",
};

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const instagramPosts = await getLatestInstagramPosts();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', ${gaId});
          `}
        </Script> */}
      </head>
      <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
        <TooltipProvider>
          <WebVitals />
          <main>
            <SiteHeader />
            {children}
            <InstagramPostSlider posts={instagramPosts} />
            <Footer />
          </main>
        </TooltipProvider>
      </body>
    </html>
  );
}
export default RootLayout;