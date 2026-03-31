"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useBabyStore } from "@/store/baby-store";
import { computeAge, STAGE_LABELS } from "@/lib/age";
import { ArrowRight, Pencil, Trash2, Baby } from "lucide-react";

const FEEDING_LABELS: Record<string, { label: string; emoji: string }> = {
  breast:  { label: "Anne Sütü",  emoji: "🤱" },
  formula: { label: "Mama",       emoji: "🍼" },
  mixed:   { label: "Karma Beslenme", emoji: "💛" },
};

const HEALTH_LABELS: Record<string, { label: string; emoji: string }> = {
  normal:   { label: "Normal",         emoji: "😊" },
  teething: { label: "Diş Çıkarıyor",  emoji: "🦷" },
  gassy:    { label: "Gaz Sancısı",    emoji: "😣" },
  picky:    { label: "Seçici Yiyor",   emoji: "🙅" },
};

const ALLERGEN_LABELS: Record<string, string> = {
  dairy:   "🥛 Süt & Süt Ürünleri",
  egg:     "🥚 Yumurta",
  gluten:  "🌾 Gluten",
  nuts:    "🥜 Kuruyemiş",
  fish:    "🐟 Balık & Deniz Ürünleri",
  soy:     "🫘 Soya",
  sesame:  "🌱 Susam",
};

const STAGE_ROUTE: Record<string, string> = {
  "newborn":     "/tarifler",
  "first-foods": "/4-6-ay",
  "explorer":    "/6-9-ay",
  "adventurer":  "/9-12-ay",
  "toddler-1":   "/12-24-ay",
  "toddler-2":   "/12-24-ay",
  "toddler-3":   "/24-36-ay",
};

export function ProfilContent() {
  const router = useRouter();
  const { baby, healthMode, onboardingCompleted, resetProfile } = useBabyStore();
  const age = baby.birthDate ? computeAge(baby.birthDate) : null;

  if (!onboardingCompleted || !baby.name) {
    return (
      <div className="text-center py-16 space-y-4">
        <Baby className="w-12 h-12 text-muted-foreground/30 mx-auto" />
        <p className="text-muted-foreground">Henüz bebek profili oluşturulmamış.</p>
        <Link href="/basla"
          className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all">
          Profil Oluştur <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const recipeHref = age ? (STAGE_ROUTE[age.stage] ?? "/tarifler") : "/tarifler";

  function handleReset() {
    if (confirm(`${baby.name} için oluşturulan profil silinecek. Emin misiniz?`)) {
      resetProfile();
      router.push("/basla");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bebek Profili</h1>
        <p className="text-muted-foreground text-sm mt-1">Bebeğinin bilgileri ve kişisel tarifleri</p>
      </div>

      {/* Profil kartı */}
      <div className="bg-card border border-border rounded-3xl p-6 space-y-5">
        {/* Avatar + İsim */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl shrink-0">
            {baby.gender === "boy" ? "👦" : "👧"}
          </div>
          <div>
            <p className="font-heading text-2xl font-bold">{baby.name}</p>
            {age && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {age.label} · {STAGE_LABELS[age.stage]}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Doğum tarihi */}
        {baby.birthDate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Doğum tarihi</span>
            <span className="font-medium">
              {new Date(baby.birthDate).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        )}

        {/* Besleme + Durum */}
        {(baby.feedingType || healthMode !== "normal") && (
          <div className="flex flex-wrap gap-2">
            {baby.feedingType && FEEDING_LABELS[baby.feedingType] && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 border border-primary/20 px-3 py-1 text-xs font-medium text-primary">
                {FEEDING_LABELS[baby.feedingType].emoji} {FEEDING_LABELS[baby.feedingType].label}
              </span>
            )}
            {HEALTH_LABELS[healthMode] && healthMode !== "normal" && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-medium text-amber-600">
                {HEALTH_LABELS[healthMode].emoji} {HEALTH_LABELS[healthMode].label}
              </span>
            )}
          </div>
        )}

        {/* Alerjiler */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Alerjiler / Hassasiyetler</p>
          {baby.allergies.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {baby.allergies.map((a) => (
                <span key={a} className="inline-flex items-center rounded-full bg-destructive/8 border border-destructive/20 px-3 py-1 text-xs font-medium text-destructive">
                  {ALLERGEN_LABELS[a] ?? a}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">Tanımlı alerji yok</p>
          )}
        </div>
      </div>

      {/* Tarifler butonu */}
      <Link href={recipeHref}
        className="flex items-center justify-between w-full rounded-2xl bg-primary text-white px-5 py-4 font-semibold hover:bg-primary/90 transition-all active:scale-98">
        <span>{baby.name} için önerilen tarifler</span>
        <ArrowRight className="w-5 h-5" />
      </Link>

      {/* İkincil aksiyonlar */}
      <div className="flex gap-3">
        <Link href="/basla"
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-medium hover:bg-muted transition-colors">
          <Pencil className="w-4 h-4" />
          Profili Düzenle
        </Link>
        <button onClick={handleReset}
          className="flex items-center justify-center gap-2 rounded-2xl border border-destructive/30 text-destructive px-4 py-3 text-sm font-medium hover:bg-destructive/8 transition-colors">
          <Trash2 className="w-4 h-4" />
          Sil
        </button>
      </div>
    </div>
  );
}
