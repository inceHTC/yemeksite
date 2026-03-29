"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Trash2, GripVertical, Upload, ImageIcon, X, Loader2 } from "lucide-react";
import type { RecipeInput, IngredientInput } from "@/app/admin/actions";
import { uploadRecipeImage } from "@/app/admin/actions";
import type { RecipeWithDetails } from "@/lib/supabase/recipes";
import Image from "next/image";
import dynamic from "next/dynamic";

const InstructionsEditor = dynamic(
  () => import("@/components/admin/instructions-editor").then((m) => m.InstructionsEditor),
  { ssr: false, loading: () => <div className="h-[220px] rounded-xl border border-border bg-muted/30 animate-pulse" /> }
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

const emptyIngredient = (): IngredientInput => ({
  name: "", amount: null, unit: "", is_optional: false, substitute: null, order: 0,
});

interface Props {
  initial?: RecipeWithDetails;
  action: (data: RecipeInput) => Promise<{ error?: string } | void>;
}

export function RecipeForm({ initial, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Temel alanlar
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [ageMin, setAgeMin] = useState(String(initial?.age_min_months ?? 4));
  const [ageMax, setAgeMax] = useState(String(initial?.age_max_months ?? 6));
  const [prepTime, setPrepTime] = useState(String(initial?.prep_time_min ?? 10));
  const [cookTime, setCookTime] = useState(String(initial?.cook_time_min ?? 15));
  const [servings, setServings] = useState(String(initial?.servings ?? 2));
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(initial?.difficulty ?? "easy");
  const [mealType, setMealType] = useState<RecipeInput["meal_type"]>(initial?.meal_type ?? "puree");
  const [texture, setTexture] = useState<RecipeInput["texture"]>(initial?.texture ?? "smooth");
  const [isFreezable, setIsFreezable] = useState(initial?.is_freezable ?? false);
  const [freezeNotes, setFreezeNotes] = useState((initial as any)?.freeze_notes ?? "");
  const [isDairyFree, setIsDairyFree] = useState(initial?.is_dairy_free ?? false);
  const [isGlutenFree, setIsGlutenFree] = useState(initial?.is_gluten_free ?? false);
  const [isSugarFree, setIsSugarFree] = useState(initial?.is_sugar_free ?? false);
  const [healthTags, setHealthTags] = useState<string[]>(initial?.health_tags ?? []);
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  // Besin değerleri
  const initNutrition = (initial?.nutritional_info as Record<string, number>) ?? {};
  const [nutrition, setNutrition] = useState({
    calories: String(initNutrition.calories ?? ""),
    protein: String(initNutrition.protein ?? ""),
    carbs: String(initNutrition.carbs ?? ""),
    fat: String(initNutrition.fat ?? ""),
    fiber: String(initNutrition.fiber ?? ""),
    iron: String(initNutrition.iron ?? ""),
    vitaminC: String(initNutrition.vitaminC ?? ""),
    vitaminA: String(initNutrition.vitaminA ?? ""),
  });

  // Malzemeler
  const [ingredients, setIngredients] = useState<IngredientInput[]>(
    initial?.recipe_ingredients?.map((i) => ({
      name: i.name, amount: i.amount || null, unit: i.unit,
      is_optional: i.is_optional, substitute: i.substitute, order: i.order,
    })) ?? [emptyIngredient()]
  );

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!initial) setSlug(slugify(val));
  }

  function toggleHealthTag(tag: string) {
    setHealthTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setImageUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadRecipeImage(fd);
      if (result?.error) {
        setImageError(result.error);
      } else if (result?.url) {
        setImageUrl(result.url);
      }
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const nutritionObj: Record<string, number> = {};
    for (const [k, v] of Object.entries(nutrition)) {
      if (v !== "") nutritionObj[k] = Number(v);
    }

    const data: RecipeInput = {
      title, slug, description,
      image_url: imageUrl || null,
      age_min_months: Number(ageMin),
      age_max_months: Number(ageMax),
      prep_time_min: Number(prepTime),
      cook_time_min: Number(cookTime),
      servings: Number(servings),
      difficulty, meal_type: mealType, texture,
      is_freezable: isFreezable,
      freeze_notes: isFreezable && freezeNotes.trim() ? freezeNotes.trim() : null,
      is_dairy_free: isDairyFree,
      is_gluten_free: isGlutenFree,
      is_sugar_free: isSugarFree,
      health_tags: healthTags,
      nutritional_info: nutritionObj,
      instructions: instructions || null,
      is_published: isPublished,
      ingredients: ingredients.map((ing, i) => ({ ...ing, amount: ing.amount ?? 0, order: i + 1 })),
    };

    startTransition(async () => {
      const result = await action(data);
      if (result?.error) setError(result.error);
    });
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const labelCls = "block text-xs font-medium text-muted-foreground mb-1.5";
  const sectionCls = "bg-background rounded-2xl border border-border p-6 space-y-5 shadow-sm";

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
              placeholder="Örn: Elmalı Yulaf Püresi"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Slug *</label>
            <input
              className={inputCls}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="elmali-yulaf-puresi"
              required
            />
          </div>

          {/* Görsel alanı */}
          <div>
            <label className={labelCls}>Görsel</label>
            <div className="space-y-2">
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
                  title="Bilgisayardan yükle"
                >
                  {imageUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
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
              {imageError && (
                <p className="text-xs text-destructive">{imageError}</p>
              )}
            </div>
          </div>

          {/* Görsel önizleme */}
          {imageUrl && (
            <div className="col-span-2">
              <label className={labelCls}>Önizleme</label>
              <div className="relative w-32 h-24 rounded-xl overflow-hidden border border-border bg-muted group">
                <Image
                  src={imageUrl}
                  alt="Tarif görseli"
                  fill
                  className="object-cover"
                  onError={() => {}}
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Görseli kaldır"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Görsel yoksa placeholder */}
          {!imageUrl && (
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
                className="w-full flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary disabled:opacity-50"
              >
                {imageUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-xs">Yükleniyor…</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    <span className="text-xs">Görsel yüklemek için tıkla veya URL gir</span>
                  </>
                )}
              </button>
            </div>
          )}

          <div className="col-span-2">
            <label className={labelCls}>Açıklama *</label>
            <textarea
              className={inputCls}
              rows={2}
              placeholder="Tarif hakkında kısa bir açıklama…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Kategori */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">2</span>
          Kategori & Özellikler
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Yaş Min (ay) *</label>
            <input type="number" className={inputCls} value={ageMin} onChange={(e) => setAgeMin(e.target.value)} min={0} required />
          </div>
          <div>
            <label className={labelCls}>Yaş Max (ay) *</label>
            <input type="number" className={inputCls} value={ageMax} onChange={(e) => setAgeMax(e.target.value)} min={0} required />
          </div>
          <div>
            <label className={labelCls}>Öğün *</label>
            <select className={inputCls} value={mealType} onChange={(e) => setMealType(e.target.value as RecipeInput["meal_type"])}>
              <option value="puree">Püre</option>
              <option value="breakfast">Kahvaltı</option>
              <option value="lunch">Öğle</option>
              <option value="dinner">Akşam</option>
              <option value="snack">Ara Öğün</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Doku *</label>
            <select className={inputCls} value={texture} onChange={(e) => setTexture(e.target.value as RecipeInput["texture"])}>
              <option value="smooth">Pürüzsüz</option>
              <option value="lumpy">Hafif Pütürlü</option>
              <option value="chunky">Parçalı</option>
              <option value="finger">Parmak Yiyeceği</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Zorluk *</label>
            <select className={inputCls} value={difficulty} onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}>
              <option value="easy">Kolay</option>
              <option value="medium">Orta</option>
              <option value="hard">Zor</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Porsiyon *</label>
            <input type="number" className={inputCls} value={servings} onChange={(e) => setServings(e.target.value)} min={1} required />
          </div>
          <div>
            <label className={labelCls}>Hazırlık (dk) *</label>
            <input type="number" className={inputCls} value={prepTime} onChange={(e) => setPrepTime(e.target.value)} min={0} required />
          </div>
          <div>
            <label className={labelCls}>Pişirme (dk) *</label>
            <input type="number" className={inputCls} value={cookTime} onChange={(e) => setCookTime(e.target.value)} min={0} required />
          </div>
        </div>
      </div>

      {/* Özellikler & Etiketler */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">3</span>
          Diyet & Sağlık Etiketleri
        </h2>
        <div>
          <label className={labelCls}>Diyet Özellikleri</label>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {[
              { label: "Dondurulabilir", val: isFreezable, set: (v: boolean) => { setIsFreezable(v); if (!v) setFreezeNotes(""); } },
              { label: "Sütsüz", val: isDairyFree, set: setIsDairyFree },
              { label: "Glutensiz", val: isGlutenFree, set: setIsGlutenFree },
              { label: "Şekersiz", val: isSugarFree, set: setIsSugarFree },
            ].map(({ label, val, set }) => (
              <label key={label} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="rounded" />
                {label}
              </label>
            ))}
          </div>
        </div>
        {isFreezable && (
          <div>
            <label className={labelCls}>Saklama Notu</label>
            <input
              className={inputCls}
              value={freezeNotes}
              onChange={(e) => setFreezeNotes(e.target.value)}
              placeholder="Örn: Buzdolabında 2 gün, dondurucuda 1 ay saklanabilir."
            />
          </div>
        )}

        <div>
          <label className={labelCls}>Sağlık Etiketleri</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "gas_friendly", label: "💨 Gaz Dostu" },
              { value: "constipation", label: "🌿 Kabızlık Önleyici" },
              { value: "immunity", label: "🛡️ Bağışıklık" },
              { value: "teething", label: "🧊 Diş Rahatlatıcı" },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => toggleHealthTag(t.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  healthTags.includes(t.value)
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Besin Değerleri */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">4</span>
          Besin Değerleri
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { key: "calories", label: "Kalori (kcal)" },
            { key: "protein", label: "Protein (g)" },
            { key: "carbs", label: "Karbonhidrat (g)" },
            { key: "fat", label: "Yağ (g)" },
            { key: "fiber", label: "Lif (g)" },
            { key: "iron", label: "Demir (mg)" },
            { key: "vitaminC", label: "Vit-C (mg)" },
            { key: "vitaminA", label: "Vit-A (mcg)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <input
                type="number"
                className={inputCls}
                value={nutrition[key as keyof typeof nutrition]}
                onChange={(e) => setNutrition((n) => ({ ...n, [key]: e.target.value }))}
                min={0}
                step="0.1"
                placeholder="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Malzemeler */}
      <div className={sectionCls}>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">5</span>
            Malzemeler
          </h2>
          <button
            type="button"
            onClick={() => setIngredients((prev) => [...prev, emptyIngredient()])}
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
          >
            <Plus className="w-3.5 h-3.5" /> Malzeme Ekle
          </button>
        </div>
        {/* Sütun başlıkları */}
        <div className="grid items-center gap-2 px-0.5" style={{ gridTemplateColumns: "1rem 1fr 4.5rem 6rem 4rem 1.75rem" }}>
          <span />
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Malzeme Adı</span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Miktar</span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Birim</span>
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide text-center">Ops.</span>
          <span />
        </div>

        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="grid items-center gap-2 group" style={{ gridTemplateColumns: "1rem 1fr 4.5rem 6rem 4rem 1.75rem" }}>
              <GripVertical className="w-4 h-4 text-muted-foreground/40 cursor-grab" />
              <input
                className={inputCls}
                placeholder="ör: Elma, Havuç, Yulaf…"
                value={ing.name}
                onChange={(e) => setIngredients((prev) => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                required
              />
              <input
                type="number"
                className={inputCls}
                placeholder="0"
                value={ing.amount ?? ""}
                onChange={(e) => setIngredients((prev) => prev.map((x, j) => j === i ? { ...x, amount: e.target.value === "" ? null : Number(e.target.value) } : x))}
                min={0}
                step="0.5"
              />
              <input
                className={inputCls}
                placeholder="g, adet, tsp…"
                value={ing.unit}
                onChange={(e) => setIngredients((prev) => prev.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))}
              />
              <div className="flex justify-center">
                <input
                  type="checkbox"
                  checked={ing.is_optional}
                  onChange={(e) => setIngredients((prev) => prev.map((x, j) => j === i ? { ...x, is_optional: e.target.checked } : x))}
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
              </div>
              <button
                type="button"
                onClick={() => setIngredients((prev) => prev.filter((_, j) => j !== i))}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Yapılışı */}
      <div className={sectionCls}>
        <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">6</span>
          Hazırlanışı
        </h2>
        <div>
          <label className={labelCls}>Tarif Adımları</label>
          <InstructionsEditor value={instructions} onChange={setInstructions} />
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
            initial ? "Güncelle" : "Tarifi Kaydet"
          )}
        </button>
      </div>
    </form>
  );
}
