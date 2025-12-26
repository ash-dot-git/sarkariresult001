import { Faustina } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("@/components/layout/Header"), { ssr: true });
const Footer = dynamic(() => import("@/components/layout/Footer"), { ssr: true });
// const DynamicGoogleAutoAds = dynamic(() => import("@/components/ads/DynamicGoogleAutoAds"), { ssr: true });

const faustina = Faustina({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-faustina',
});

export const metadata = {
  metadataBase: new URL('https://newsarkariresult.co.in'),
  alternates: {
    canonical: 'https://newsarkariresult.co.in',
  },
  title: {
    default: "Sarkari Result |Sarkari Result 2025 | newsarkariresult.co.in",
    template: "%s",
  },
  description: "Find Sarkari Result updates, Online Forms, Admit Cards, Answer Keys, Syllabus, Sarkari Yojana, and Scholarships.",
  verification: {
    google: 'googlec7bba8d22d0ca581',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "Sarkari Result 2025 |Sarkari Result | newsarkariresult.co.in",
    description: "Find Sarkari Result updates...",
    url: 'https://newsarkariresult.co.in',
    siteName: 'Sarkari Result',
    images: [
      {
        url: 'https://newsarkariresult.co.in/banner.png',
        width: 1200,
        height: 630,
        alt: 'Sarkari Result Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sarkari Result 2025 | Sarkari Result",
    description: "Find Sarkari Result updates...",
    images: ['/og-image.webp'],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#cd0808",
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={faustina.variable}>
        {/* <DynamicGoogleAutoAds /> */}
        {/* Google Tag Manager */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-TJ22NM1MCP" strategy="afterInteractive" />
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TJ22NM1MCP');
            `,
          }}
        />
        {/* Structured Data */}
        <Script
          id="structured-data-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              url: "https://newsarkariresult.co.in",
              logo: "https://newsarkariresult.co.in/logo.png",
            }),
          }}
        />
        <Script
          id="structured-data-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              url: "https://newsarkariresult.co.in",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://newsarkariresult.co.in/?s={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        <div className="flex flex-col min-h-screen font-arial md:flex-row md:justify-center">
          {/* <aside className="w-fit google-ads" /> */}
          <div className="flex-1 flex flex-col max-w-[1070px]">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
          {/* <aside className="w-fit google-ads" /> */}
        </div>
      </body>
    </html>
  );
}

