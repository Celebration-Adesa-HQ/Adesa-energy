/* eslint-disable @next/next/no-img-element */
import { Inter, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Providers from "./provider";
import AppShell from "./appshell";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { constructMetadata } from "@/lib/metadata";
import Image from "next/image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata = constructMetadata();

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#59C6E5" },
    { media: "(prefers-color-scheme: dark)", color: "#22244E" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;
            n.push=n;
            n.loaded=!0;
            n.version='2.0';
            n.queue=[];
            t=b.createElement(e);
            t.async=!0;
            t.src=v;
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s);
            }(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

            fbq('init', '1005345295218015');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>

      <body
        className={`${inter.variable} ${montserrat.variable} bg-background text-foreground transition-colors`}
      >
        {/* Meta Pixel NoScript */}
        <noscript>
          <Image
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1005345295218015&ev=PageView&noscript=1"
            alt="facebook_meta"
          />
        </noscript>

        <ThemeProvider
          attribute="class"
          enableSystem={false}
          defaultTheme="dark"
        >
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Adesa Energy",
              url: "https://www.adesaenergy.com",
              logo: "https://www.adesaenergy.com/adesa-energy.png",
              sameAs: [
                "https://twitter.com/adesaenergy",
                "https://linkedin.com/company/adesa-energy",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
