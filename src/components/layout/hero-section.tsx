"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* ── Mobil görsel (< sm) ── */}
      <div className="relative w-full sm:hidden" style={{ aspectRatio: "16/9" }}>
        <Image
          src="/hero.png"
          alt="Tok Bebek — Anne bebeğini besliyor"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "60% center" }}
          sizes="100vw"
          unoptimized
        />
      </div>

      {/* ── Masaüstü görsel (sm+) ── */}
      <div className="relative w-full hidden sm:block" style={{ aspectRatio: "7/2" }}>
        <Image
          src="/hero.png"
          alt="Tok Bebek — Anne bebeğini besliyor"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          unoptimized
        />
      </div>

    </section>
  );
}
