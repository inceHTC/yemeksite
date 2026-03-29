"use client";

import { useBabyStore } from "@/store/baby-store";
import { computeAge, STAGE_LABELS } from "@/lib/age";
import { ModeSelector } from "./mode-selector";

const STAGE_TIPS: Record<string, string> = {
  "first-foods": "İlk tamamlayıcı besine başlama zamanı! Tek malzemeli pürelerden başlayın.",
  explorer: "Yeni dokular keşfediyoruz! Hafif pütürlü karışımlar deneyin.",
  adventurer: "Parmak yiyecekler başlayabilir. BLW için harika bir dönem!",
  "toddler-1": "Aile yemeğine geçiş zamanı. Tuzsuz ve şekersiz versiyonlar hazırlayın.",
  "toddler-2": "Çeşitlilik önemli. Farklı renk ve dokularda yiyecekler sunun.",
  "toddler-3": "Bağımsız yemek yeme alışkanlıkları gelişiyor!",
  newborn: "Henüz yalnızca anne sütü veya mama dönemi.",
};

export function BabyWelcomeCard() {
  const { baby, onboardingCompleted } = useBabyStore();
  const age = baby.birthDate ? computeAge(baby.birthDate) : null;

  if (!onboardingCompleted || !baby.name) return null;

  // 🔥 sadeleştirildi
  const babyEmoji = baby.gender === "girl" ? "👧" : "👦";

  const tip = age ? STAGE_TIPS[age.stage] : null;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-teal/10 border border-primary/20 p-5 space-y-4">
      {/* Karşılama */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{babyEmoji}</span>
        <div>
          <h2 className="font-heading text-xl font-bold">
            Merhaba, {baby.name}!{" "}
            {age && <span className="text-primary">{age.label}</span>}
          </h2>
          {age && (
            <p className="text-sm text-muted-foreground">
              {STAGE_LABELS[age.stage]}
            </p>
          )}
        </div>
      </div>

      {/* Gelişim ipucu */}
      {tip && (
        <div className="flex gap-2 bg-background/60 rounded-2xl p-3">
          <span className="text-lg flex-shrink-0">💡</span>
          <p className="text-sm text-muted-foreground">{tip}</p>
        </div>
      )}

      {/* Mod seçici */}
      <ModeSelector />
    </div>
  );
}