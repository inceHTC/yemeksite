import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── SVG İllüstrasyonlar ──────────────────────────────────────────────────────

function IllustrationNoRecipes() {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Kase */}
      <ellipse cx="80" cy="92" rx="44" ry="10" fill="#FFE66D" fillOpacity="0.4" />
      <path d="M44 72 Q44 100 80 100 Q116 100 116 72 Z" fill="#FF6B6B" fillOpacity="0.15" />
      <path d="M44 72 Q44 100 80 100 Q116 100 116 72" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <rect x="70" y="98" width="20" height="6" rx="3" fill="#FF6B6B" fillOpacity="0.3" />
      <ellipse cx="80" cy="72" rx="36" ry="8" fill="#FFF" stroke="#FF6B6B" strokeWidth="2" />
      {/* Soru işaretleri */}
      <text x="58" y="60" fontSize="14" fill="#4ECDC4" fontWeight="bold" opacity="0.7">?</text>
      <text x="88" y="54" fontSize="10" fill="#FF6B6B" fontWeight="bold" opacity="0.5">?</text>
      <text x="74" y="48" fontSize="18" fill="#FFE66D" fontWeight="bold" opacity="0.6">?</text>
      {/* Yıldızlar */}
      <circle cx="30" cy="45" r="3" fill="#FFE66D" opacity="0.6" />
      <circle cx="130" cy="50" r="2" fill="#4ECDC4" opacity="0.5" />
      <circle cx="125" cy="35" r="4" fill="#FF6B6B" opacity="0.3" />
      <circle cx="35" cy="65" r="2" fill="#FF6B6B" opacity="0.4" />
    </svg>
  );
}

function IllustrationNoFavorites() {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Kalp ana */}
      <path
        d="M80 105 C80 105 38 78 38 55 C38 43 47 35 57 35 C64 35 71 39 80 47 C89 39 96 35 103 35 C113 35 122 43 122 55 C122 78 80 105 80 105Z"
        fill="#FF6B6B" fillOpacity="0.12" stroke="#FF6B6B" strokeWidth="2" strokeLinejoin="round"
      />
      {/* Küçük kalpler */}
      <path
        d="M32 30 C32 30 22 23 22 18 C22 14 25 12 28 12 C30 12 31 13 32 14 C33 13 34 12 36 12 C39 12 42 14 42 18 C42 23 32 30 32 30Z"
        fill="#FF6B6B" fillOpacity="0.3"
      />
      <path
        d="M130 40 C130 40 122 34 122 30 C122 27 124 25 127 25 C128 25 129 26 130 27 C131 26 132 25 133 25 C136 25 138 27 138 30 C138 34 130 40 130 40Z"
        fill="#4ECDC4" fillOpacity="0.4"
      />
      {/* Artı işareti — henüz eklenmedi */}
      <circle cx="80" cy="70" r="14" fill="white" stroke="#FF6B6B" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="80" y1="64" x2="80" y2="76" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="74" y1="70" x2="86" y2="70" stroke="#FF6B6B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Zemin gölgesi */}
      <ellipse cx="80" cy="112" rx="30" ry="5" fill="#FF6B6B" fillOpacity="0.08" />
    </svg>
  );
}

function IllustrationNoSearchResults() {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Büyüteç */}
      <circle cx="72" cy="65" r="30" fill="#4ECDC4" fillOpacity="0.1" stroke="#4ECDC4" strokeWidth="2.5" />
      <circle cx="72" cy="65" r="22" fill="white" stroke="#4ECDC4" strokeWidth="1.5" />
      <line x1="94" y1="88" x2="112" y2="106" stroke="#4ECDC4" strokeWidth="4" strokeLinecap="round" />
      <line x1="91" y1="85" x2="95" y2="89" stroke="#4ECDC4" strokeWidth="6" strokeLinecap="round" />
      {/* İçinde üzgün yüz */}
      <circle cx="66" cy="62" r="3" fill="#FF6B6B" fillOpacity="0.5" />
      <circle cx="78" cy="62" r="3" fill="#FF6B6B" fillOpacity="0.5" />
      <path d="M66 72 Q72 68 78 72" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Dekoratif elementler */}
      <circle cx="30" cy="40" r="4" fill="#FFE66D" opacity="0.5" />
      <circle cx="130" cy="45" r="3" fill="#FF6B6B" opacity="0.4" />
      <circle cx="135" cy="95" r="5" fill="#4ECDC4" opacity="0.3" />
      <circle cx="25" cy="90" r="3" fill="#FFE66D" opacity="0.4" />
    </svg>
  );
}

function IllustrationNoArticles() {
  return (
    <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Kitap */}
      <rect x="45" y="35" width="70" height="85" rx="6" fill="#4ECDC4" fillOpacity="0.12" stroke="#4ECDC4" strokeWidth="2" />
      <rect x="45" y="35" width="6" height="85" rx="3" fill="#4ECDC4" fillOpacity="0.3" />
      {/* Satırlar */}
      <line x1="60" y1="58" x2="105" y2="58" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="60" y1="68" x2="100" y2="68" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="60" y1="78" x2="105" y2="78" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="60" y1="88" x2="90" y2="88" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Yıldız */}
      <circle cx="83" cy="110" r="8" fill="#FFE66D" fillOpacity="0.5" />
      <text x="79" y="114" fontSize="10" fill="#FFE66D">★</text>
      {/* Dekor */}
      <circle cx="28" cy="50" r="5" fill="#FF6B6B" opacity="0.3" />
      <circle cx="132" cy="100" r="4" fill="#FFE66D" opacity="0.5" />
    </svg>
  );
}

// ─── Tip tanımları ────────────────────────────────────────────────────────────

type EmptyVariant = "no-recipes" | "no-favorites" | "no-search" | "no-articles";

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const DEFAULTS: Record<EmptyVariant, Omit<EmptyStateProps, "variant" | "className">> = {
  "no-recipes": {
    title: "Tarif bulunamadı",
    description: "Filtreleri değiştirerek veya farklı bir arama yaparak tekrar deneyin.",
    cta: { label: "Filtreleri Temizle", href: "/tarifler" },
  },
  "no-favorites": {
    title: "Henüz favori eklemediniz",
    description: "Tariflerdeki kalp ikonuna tıklayarak favori listenize ekleyebilirsiniz.",
    cta: { label: "Tarifleri Keşfet", href: "/tarifler" },
  },
  "no-search": {
    title: "Sonuç bulunamadı",
    description: "Farklı bir kelime ya da malzeme adı deneyin.",
    cta: { label: "Tariflere Bak", href: "/tarifler" },
  },
  "no-articles": {
    title: "Makale bulunamadı",
    description: "Bu kategoride henüz içerik yok. Yakında eklenecek.",
    cta: { label: "Tüm Makaleler", href: "/akademi" },
  },
};

const ILLUSTRATIONS: Record<EmptyVariant, React.FC> = {
  "no-recipes": IllustrationNoRecipes,
  "no-favorites": IllustrationNoFavorites,
  "no-search": IllustrationNoSearchResults,
  "no-articles": IllustrationNoArticles,
};

// ─── Bileşen ──────────────────────────────────────────────────────────────────

export function EmptyState({
  variant = "no-recipes",
  title,
  description,
  cta,
  className,
}: EmptyStateProps) {
  const defaults = DEFAULTS[variant];
  const Illustration = ILLUSTRATIONS[variant];

  const resolvedTitle = title ?? defaults.title;
  const resolvedDescription = description ?? defaults.description;
  const resolvedCta = cta ?? defaults.cta;

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center px-4", className)}>
      <div className="w-40 h-32 mb-4">
        <Illustration />
      </div>

      <h3 className="font-heading font-bold text-lg text-foreground mb-1.5">
        {resolvedTitle}
      </h3>

      {resolvedDescription && (
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-5">
          {resolvedDescription}
        </p>
      )}

      {resolvedCta && (
        resolvedCta.href ? (
          <Link
            href={resolvedCta.href}
            className="rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {resolvedCta.label}
          </Link>
        ) : (
          <button
            onClick={resolvedCta.onClick}
            className="rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            {resolvedCta.label}
          </button>
        )
      )}
    </div>
  );
}
