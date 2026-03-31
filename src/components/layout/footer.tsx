import Link from "next/link";

const RECIPE_LINKS = [
  { href: "/tarifler?ageGroup=4-6", label: "4-6 Ay Tarifleri" },
  { href: "/tarifler?ageGroup=6-9", label: "6-9 Ay Tarifleri" },
  { href: "/tarifler?ageGroup=9-12", label: "9-12 Ay Tarifleri" },
  { href: "/tarifler?ageGroup=12-24", label: "12-24 Ay Tarifleri" },
  { href: "/tarifler?meal=puree", label: "Püre Tarifleri" },
  { href: "/tarifler?meal=breakfast", label: "Kahvaltı Tarifleri" },
  { href: "/tarifler?meal=lunch", label: "Öğle Yemeği Tarifleri" },
  { href: "/tarifler?freezable=true", label: "Dondurulabilir Tarifler" },
];

const HEALTH_LINKS = [
  { href: "/destek/gaz-sancisi", label: "Gaz Sancısına Ne İyi Gelir?" },
  { href: "/destek/dis-cikarma", label: "Diş Çıkarma Döneminde Beslenme" },
  { href: "/destek/kabizlik", label: "Bebek Kabızlığı İçin Tarifler" },
  { href: "/destek/secici-yeme", label: "Seçici Yeme Çözümleri" },
  { href: "/destek/bagisiklik", label: "Bağışıklık Güçlendiren Tarifler" },
  { href: "/destek/demir-eksikligi", label: "Demir Eksikliği Tarifleri" },
  { href: "/destek/ishal", label: "İshalde Ne Yedireyim?" },
  { href: "/destek/reflu", label: "Bebek Reflüsü Beslenme Rehberi" },
  { href: "/destek/ates", label: "Ateşli Bebekte Beslenme" },
];

const COMPANY_LINKS = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/akademi", label: "Tok Bebek Dergisi" },
  { href: "/basla", label: "Bebek Profili Oluştur" },
  { href: "/gizlilik", label: "Gizlilik Politikası" },
  { href: "/kullanim-kosullari", label: "Kullanım Koşulları" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-16">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Marka */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <svg viewBox="0 0 44 44" fill="none" className="w-9 h-9 shrink-0" aria-hidden="true">
                {/* Daire arka plan */}
                <circle cx="22" cy="22" r="22" fill="#007a3f" />

                {/* Bebek yüzü */}
                <circle cx="20" cy="22" r="13" fill="white" />

                {/* Gözler */}
                <circle cx="14.5" cy="19" r="2" className="fill-primary" />
                <circle cx="23.5" cy="19" r="2" className="fill-primary" />

                {/* Gülen ağız */}
                <path d="M 14 24.5 Q 19 30 25 24.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" className="stroke-primary" />

                {/* Kaşık ovalı — ağzın önünde, mama dolu */}
                <ellipse cx="26" cy="27.5" rx="5.5" ry="3.2" className="fill-primary" />
                <ellipse cx="26" cy="27.5" rx="3.5" ry="1.8" fill="white" opacity="0.35" />

                {/* Kaşık sapı — sağa uzanıyor */}
                <line x1="31" y1="26.5" x2="41" y2="22" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </svg>

              <div className="flex items-baseline leading-none">
                <span
                  className="font-heading font-extrabold text-4xl tracking-tight"
                  style={{
                    color: "#007a3f",
                    textShadow: "0 1px 0 #006535, 0 2px 0 #00502a, 0 3px 0 #003d20, 0 4px 0 #002b16, 0 5px 0 #001a0d, 0 5px 12px rgba(0,0,0,0.35)",
                  }}
                >Tok</span>
                <span
                  className="font-heading font-extrabold text-4xl tracking-tight"
                  style={{
                    color: "#1c1c1c",
                    textShadow: "0 1px 0 #666, 0 2px 0 #555, 0 3px 0 #444, 0 4px 0 #333, 0 4px 10px rgba(0,0,0,0.3)",
                  }}
                >Bebek</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              4–36 aylık bebekler için bilimsel temelli, lezzetli ve güvenli yemek tarifleri.
              WHO ve AAP rehberlerine uygun içerik.
            </p>
            <a
              href="https://www.instagram.com/tok_bebek"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              @tok_bebek
            </a>
            <p className="text-xs text-muted-foreground italic">
              ⚠️ Bu site tıbbi tavsiye vermez. Doktorunuza danışın.
            </p>
          </div>

          {/* Tarifler */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-3">Tarifler</h3>
            <ul className="space-y-2">
              {RECIPE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sağlık & Çözüm */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-3">Çözüm Merkezi</h3>
            <ul className="space-y-2">
              {HEALTH_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Şirket */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wide mb-3">Tok Bebek</h3>
            <ul className="space-y-2">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-3">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            Bu sitedeki tüm tarif, metin, görsel ve içerikler Tok Bebek&apos;e aittir.{" "}
            <strong className="text-foreground/70">İzinsiz kopyalanması, paylaşılması veya yayımlanması yasaktır.</strong>{" "}
            İçeriklerimizi kullanmak için{" "}
            <a href="/iletisim" className="underline hover:text-foreground transition-colors">iletişime geçin</a>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Tok Bebek. Tüm hakları saklıdır.</p>
            <p>Türkiye&apos;nin bebek beslenmesi platformu 🇹🇷</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
