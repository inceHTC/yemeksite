"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-black">

      {/* ── Mobil görsel (< lg) ── */}
      <div className="relative w-full lg:hidden" style={{ aspectRatio: "1/1" }}>
        <Image
          src="/1-mobile.jpg"
          alt="Tok Bebek"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Masaüstü görsel (lg+) ── */}
      <div className="hidden lg:block w-full">
        <Image
          src="/hero11.jpg"
          alt="Tok Bebek — Sağlıklı bebek yemekleri"
          width={1920}
          height={600}
          priority
          className="w-full h-auto block"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlay — her iki görsel için ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/15 via-black/30 to-black/15" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* ── Yazılar — üst ── */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-center pt-8 sm:pt-10 lg:pt-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-white/85 tracking-wide">
            Türkiye&apos;nin bebek beslenmesi platformu
          </span>
        </div>
        <h1 className="font-heading font-extrabold leading-tight drop-shadow-md mb-3">
          <span className="block text-white text-2xl sm:text-4xl lg:text-5xl">Bebekler Tok,</span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl" style={{ color: "#4ade80" }}>Anneler Mutlu.</span>
        </h1>

      </div>

      {/* ── Butonlar — alt ── */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2.5 sm:gap-3 pb-8 sm:pb-10 lg:pb-12 px-4">


        <Link
          href="/tarifler"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 sm:px-6 text-xs sm:text-sm font-semibold text-white transition-all active:scale-95 shadow-lg"
          style={{ background: "#007a3f" }}
        >
          Tarifleri Keşfet <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
        <Link
          href="/basla"
          className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm text-white px-5 py-2.5 sm:px-6 text-xs sm:text-sm font-semibold hover:bg-white/20 transition-all active:scale-95"
        >
          Bebeğime Özel
        </Link>
      </div>

    </section>
  );
}
