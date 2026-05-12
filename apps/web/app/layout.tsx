import { Geist, Geist_Mono, Barlow, Barlow_Condensed } from "next/font/google";

import "./globals.css";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import { WebVitals } from "@/components/web-vitals";
import Script from "next/script";
import { TooltipProvider } from "@workspace/ui/components/tooltip";
import { getLatestInstagramPosts } from "@/lib/instagram";
import InstagramPostSlider from "@/components/global/instagram-post-slider";
import { DEFAULT_META } from "@/lib/const";
import SmoothScroll from "@/components/global/scroll-smooth";
import { ViewTransition } from "react";

export const metadata: Metadata = {
  title: DEFAULT_META.title,
  description: DEFAULT_META.description,
  keywords: DEFAULT_META.keywords,
};

const fontSans = Barlow({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--font-sans",
});

const fontMono = Barlow_Condensed({
  subsets: ["latin"],
  weight: ['400', '700'],
  variable: "--variable",
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
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <SmoothScroll>
          <TooltipProvider>
            <WebVitals />
            <main>
              <ViewTransition>
                <SiteHeader />
                {children}
                <InstagramPostSlider posts={instagramPosts} />
                <Footer />
              </ViewTransition>
            </main>
          </TooltipProvider>
        </SmoothScroll>
      </body>
    </html>
  );
};
export default RootLayout;
