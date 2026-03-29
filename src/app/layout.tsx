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
  keywords: ["bebek yemekleri", "bebek tarifleri", "tamamlayıcı besin", "bebek beslenmesi", "püre tarifleri"],
  authors: [{ name: "Tok Bebek" }],
  creator: "Tok Bebek",
  metadataBase: new URL("https://bebi.life"),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Tok Bebek",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
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
