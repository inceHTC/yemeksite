"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, BookOpen, ChevronRight, Sparkles } from "lucide-react";
import type { Article } from "@/types/supabase";

const CATEGORY_LABEL: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

interface Props {
  featured: Article;
  teasers: Article[];
  totalCount: number;
}

function getIssueMeta() {
  const now = new Date();
  const month = now.toLocaleDateString("tr-TR", { month: "long" }).toUpperCase();
  const year = now.getFullYear();
  return { month, year };
}

export function MagazineCover({ featured, teasers, totalCount }: Props) {
  const { month, year } = getIssueMeta();

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl" style={{ minHeight: "540px" }}>
      {/* Background layer: featured image or gradient */}
      <div className="absolute inset-0">
        {featured.image_url ? (
          <Image
            src={featured.image_url}
            alt=""
            fill
            className="object-cover scale-105"
            priority
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
        )}
        {/* Gradient overlay — editorial dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-6 sm:p-10" style={{ minHeight: "540px" }}>

        {/* Top bar — masthead */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em]">
                Tok Bebek Dergisi
              </span>
            </div>
            <h1 className="font-heading text-white text-3xl sm:text-5xl font-extrabold leading-none tracking-tight">
              Anne &amp; Bebek
            </h1>
            <p className="font-heading text-white/70 text-xl sm:text-3xl font-semibold tracking-widest uppercase mt-0.5">
              Dergisi
            </p>
          </div>

          {/* Issue stamp */}
          <div className="text-right flex flex-col items-end gap-1">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-right">
              <p className="text-white/60 text-[9px] font-semibold uppercase tracking-widest">Sayı</p>
              <p className="font-heading text-white text-3xl font-extrabold leading-none">{totalCount}</p>
              <p className="text-white/60 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Makale</p>
            </div>
            <p className="text-white/50 text-xs font-medium tracking-wider">
              {month} {year}
            </p>
          </div>
        </div>

        {/* Center — featured article */}
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1.5 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                Öne Çıkan
              </div>
              <span className="text-white/60 text-xs font-medium border border-white/20 rounded-full px-2.5 py-0.5">
                {CATEGORY_LABEL[featured.category] ?? featured.category}
              </span>
            </div>
            <h2 className="font-heading text-white text-xl sm:text-3xl font-bold leading-snug mb-3">
              {featured.title}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 max-w-lg">
              {featured.excerpt}
            </p>
            <Link
              href={`/akademi/${featured.slug}`}
              className="inline-flex items-center gap-2 bg-white text-primary rounded-full px-5 py-2.5 text-sm font-bold hover:bg-white/90 transition-all group shadow-lg"
            >
              Makaleyi Oku
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

     
      </div>
    </div>
  );
}
