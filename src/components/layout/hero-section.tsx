"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* ── Mobil görsel (< lg) ── */}
      <div className="relative w-full lg:hidden" style={{ aspectRatio: "1/1" }}>
        <Image
          src="/mobile1.jpg"
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
          src="/hero.jpg"
          alt="Tok Bebek — Sağlıklı bebek yemekleri"
          width={1920}
          height={600}
          priority
          className="w-full h-auto block"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlay — sadece yazı okunabilirliği için ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

      {/* ── Yazılar — üst ── */}
      <div className="absolute inset-x-0 top-0 flex flex-col items-start sm:items-center pt-8 sm:pt-10 lg:pt-12 pl-[45%] pr-3 sm:pl-4 sm:pr-4 text-left sm:text-center">
    <br />
        <h1 className="font-heading font-extrabold leading-tight drop-shadow-md mb-3">
          <span className="block text-white text-2xl sm:text-4xl lg:text-5xl">Bebekler Tok,</span>
          <span className="block text-2xl sm:text-4xl lg:text-5xl" style={{ color: "#000" }}>Anneler Mutlu.</span>
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
