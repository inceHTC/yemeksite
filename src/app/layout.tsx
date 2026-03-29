import type { Metadata } from "next";
import { Inter, Baloo_2, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const baloo2 = Baloo_2({
  variable: "--font-baloo2",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tok Bebek — Bebek Yemekleri Tarifleri",
    template: "%s | Tok Bebek",
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Tok Bebek" },
  formatDetection: { telephone: false },
  description:
    "Bebeğinizin yaşına özel, bilimsel ve lezzetli yemek tarifleri. WHO ve AAP verilerine dayalı, Türkiye'nin en kapsamlı bebek beslenmesi platformu.",
  keywords: [
    "bebek yemekleri", "bebek tarifleri", "tamamlayıcı besin", "bebek beslenmesi",
    "püre tarifleri", "bebek püresi", "ek gıda", "tamamlayıcı beslenme",
    "4 aylık bebek yemeği", "6 aylık bebek yemeği", "bebek beslenmesi rehberi",
  ],
  authors: [{ name: "Tok Bebek" }],
  creator: "Tok Bebek",
  publisher: "Tok Bebek",
  metadataBase: new URL("https://tokbebek.com.tr"),
  alternates: {
    canonical: "https://tokbebek.com.tr",
    languages: { "tr-TR": "https://tokbebek.com.tr" },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Tok Bebek",
    url: "https://tokbebek.com.tr",
    title: "Tok Bebek — Bebek Yemekleri Tarifleri",
    description: "Bebeğinizin yaşına özel, bilimsel ve lezzetli yemek tarifleri. WHO ve AAP verilerine dayalı, Türkiye'nin en kapsamlı bebek beslenmesi platformu.",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Tok Bebek" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tokbebek",
    creator: "@tokbebek",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "food",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Tok Bebek",
  url: "https://tokbebek.com.tr",
  description: "Bebeğinizin yaşına özel, bilimsel ve lezzetli yemek tarifleri. WHO ve AAP verilerine dayalı, Türkiye'nin en kapsamlı bebek beslenmesi platformu.",
  inLanguage: "tr",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://tokbebek.com.tr/ara?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tok Bebek",
  url: "https://tokbebek.com.tr",
  logo: {
    "@type": "ImageObject",
    url: "https://tokbebek.com.tr/icon-512.png",
    width: 512,
    height: 512,
  },
  description: "Türkiye'nin en kapsamlı bebek beslenmesi platformu. WHO ve AAP verilerine dayalı, yaşa özel bebek yemekleri tarifleri.",
  foundingLocation: {
    "@type": "Country",
    name: "Türkiye",
  },
  knowsAbout: ["bebek beslenmesi", "tamamlayıcı besin", "bebek yemekleri", "ek gıda"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      suppressHydrationWarning
      className={`${inter.variable} ${baloo2.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <ScrollToTop />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
