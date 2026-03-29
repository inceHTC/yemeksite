"use client";

import { useState, useTransition, useRef } from "react";
import { Upload, ImageIcon, X, Loader2, Plus, Trash2 } from "lucide-react";
import type { ArticleInput } from "@/app/admin/actions";
import { uploadArticleImage } from "@/app/admin/actions";
import type { Article } from "@/types/supabase";
import Image from "next/image";
import dynamic from "next/dynamic";

const ArticleEditor = dynamic(
  () => import("@/components/admin/article-editor").then((m) => m.ArticleEditor),
  { ssr: false, loading: () => <div className="h-[450px] rounded-xl border border-border bg-muted/30 animate-pulse" /> }
);

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const CATEGORY_LABELS: Record<string, string> = {
  nutrition: "Beslenme",
  development: "Gelişim",
  health: "Sağlık",
  safety: "Güvenlik",
};

interface Props {
  initial?: Article;
  action: (data: ArticleInput) => Promise<{ error?: string } | void>;
}

export function ArticleForm({ initial, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [category, setCategory] = useState<ArticleInput["category"]>(
    initial?.category ?? "nutrition"
  );
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [readingTime, setReadingTime] = useState(
    String(initial?.reading_time_min ?? 5)
  );
  const [sources, setSources] = useState<string[]>(
    Array.isArray(initial?.sources) ? (initial.sources as string[]) : [""]
  );
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!initial) setSlug(slugify(val));
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadArticleImage(fd);
      if (result?.error) setImageError(result.error);
      else if (result?.url) setImageUrl(result.url);
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const data: ArticleInput = {
      title,
      slug,
      excerpt,
      content,
      category,
      image_url: imageUrl || null,
      reading_time_min: Number(readingTime),
      sources: sources.filter((s) => s.trim() !== ""),
      is_published: isPublished,
    };

    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setError(result.error);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";
  const sectionCls =
    "bg-background rounded-2xl border border-border p-6 space-y-5 shadow-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3 flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">1</span>
          Temel Bilgiler
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Başlık *</label>
            <input
              className={inputCls}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Örn: Tamamlayıcı Besine Nasıl Başlanır?"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tamamlayici-besine-baslangic"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Kategori *</label>
            <select
              className={inputCls}
              value={category}
              onChange={(e) => setCategory(e.target.value as ArticleInput["category"])}
            >
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Özet / Kısa Açıklama *</label>
            <textarea
              className={inputCls}
              rows={2}
              placeholder="Makale hakkında 1-2 cümlelik kısa açıklama…"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Okuma Süresi (dakika) *</label>
            <input
              type="number"
              className={inputCls}
              value={readingTime}
              onChange={(e) => setReadingTime(e.target.value)}
              min={1}
              max={60}
              required
            />
          </div>
        </div>
      </div>

      {/* Kapak Görseli */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
          Kapak Görseli
        </h2>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              className={inputCls + " flex-1"}
              value={imageUrl}
              onChange={(e) => { setImageUrl(e.target.value); setImageError(null); }}
              placeholder="https://... veya bilgisayardan yükle"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              {imageUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {imageUploading ? "Yükleniyor…" : "Yükle"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {imageError && <p className="text-xs text-destructive">{imageError}</p>}

          {imageUrl ? (
            <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden border border-border bg-muted group">
              <Image src={imageUrl} alt="Kapak görseli" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="w-full flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary disabled:opacity-50"
            >
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs">Kapak görseli yüklemek için tıkla</span>
            </button>
          )}
        </div>
      </div>

      {/* İçerik Editörü */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
          Makale İçeriği *
        </h2>
        <ArticleEditor
          value={content}
          onChange={setContent}
          placeholder="Makaleyi buraya yazın. Başlık, paragraf, liste ve alıntı ekleyebilirsiniz…"
        />
      </div>

      {/* Kaynaklar */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">4</span>
            Kaynaklar
          </h2>
          <button
            type="button"
            onClick={() => setSources((prev) => [...prev, ""])}
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Kaynak Ekle
          </button>
        </div>
        <div className="space-y-2">
          {sources.map((src, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputCls + " flex-1"}
                value={src}
                onChange={(e) =>
                  setSources((prev) => prev.map((s, j) => (j === i ? e.target.value : s)))
                }
                placeholder="https://who.int/... veya kaynak başlığı"
              />
              <button
                type="button"
                onClick={() => setSources((prev) => prev.filter((_, j) => j !== i))}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {sources.length === 0 && (
            <p className="text-xs text-muted-foreground">Henüz kaynak eklenmedi.</p>
          )}
        </div>
      </div>

      {/* Kaydet */}
      <div className="flex items-center gap-4 pb-8">
        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded"
          />
          Yayınla
        </label>
        <button
          type="submit"
          disabled={isPending || imageUploading}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Kaydediliyor…
            </>
          ) : (
            initial ? "Güncelle" : "Makaleyi Kaydet"
          )}
        </button>
      </div>
    </form>
  );
}
