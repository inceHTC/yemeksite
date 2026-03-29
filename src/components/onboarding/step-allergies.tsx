"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Allergen } from "@/store/baby-store";

interface AllergenOption {
  value: Allergen;
  label: string;
  emoji: string;
  description: string;
}

const ALLERGEN_OPTIONS: AllergenOption[] = [
  { value: "dairy", label: "Süt & Süt Ürünleri", emoji: "🥛", description: "İnek sütü, yoğurt, peynir" },
  { value: "egg", label: "Yumurta", emoji: "🥚", description: "Tavuk yumurtası" },
  { value: "gluten", label: "Gluten", emoji: "🌾", description: "Buğday, arpa, çavdar" },
  { value: "nuts", label: "Kuruyemiş", emoji: "🥜", description: "Fıstık, fındık, badem..." },
  { value: "fish", label: "Balık & Deniz Ürünleri", emoji: "🐟", description: "Tüm balık çeşitleri" },
  { value: "soy", label: "Soya", emoji: "🫘", description: "Soya fasulyesi, soya sütü" },
  { value: "sesame", label: "Susam", emoji: "🌰", description: "Susam, tahin" },
];

interface StepAllergiesProps {
  value: Allergen[];
  onChange: (allergies: Allergen[]) => void;
  onFinish: () => void;
  onBack: () => void;
}

export function StepAllergies({ value, onChange, onFinish, onBack }: StepAllergiesProps) {
  const [selected, setSelected] = useState<Allergen[]>(value);
  const [noAllergy, setNoAllergy] = useState(value.length === 0);

  function toggleAllergen(allergen: Allergen) {
    setNoAllergy(false);
    setSelected((prev) =>
      prev.includes(allergen)
        ? prev.filter((a) => a !== allergen)
        : [...prev, allergen]
    );
  }

  function handleNoAllergy() {
    setNoAllergy(true);
    setSelected([]);
  }

  function handleFinish() {
    onChange(selected);
    onFinish();
  }

  return (
    <div className="space-y-5">
      {/* Başlık */}
      <div className="text-center">
        <span className="text-6xl">🛡️</span>
        <h2 className="font-heading text-2xl font-bold mt-3">
          Alerji & Hassasiyetler
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bebeğinizin alerjilerini işaretleyin, tariflerde otomatik uyarı gösterelim.
        </p>
      </div>

      {/* "Alerji yok" seçeneği */}
      <button
        type="button"
        onClick={handleNoAllergy}
        className={`w-full flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
          noAllergy
            ? "border-success bg-success/10 text-success"
            : "border-border bg-background hover:bg-muted"
        }`}
      >
        <span className="text-2xl">✅</span>
        <div>
          <p className="font-semibold text-sm">Bilinen alerji yok</p>
          <p className="text-xs text-muted-foreground">Tüm malzemeleri göster</p>
        </div>
        {noAllergy && <span className="ml-auto text-success font-bold">✓</span>}
      </button>

      {/* Alerjen listesi */}
      <div className="grid grid-cols-1 gap-2">
        {ALLERGEN_OPTIONS.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleAllergen(opt.value)}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all ${
                isSelected
                  ? "border-destructive/60 bg-destructive/5 text-destructive dark:bg-destructive/10"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span className="text-xl">{opt.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className="text-xs text-muted-foreground truncate">{opt.description}</p>
              </div>
              <div className={`size-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isSelected
                  ? "border-destructive bg-destructive"
                  : "border-border"
              }`}>
                {isSelected && <span className="text-white text-xs font-bold">✕</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Seçim özeti */}
      {selected.length > 0 && (
        <p className="text-xs text-center text-muted-foreground">
          {selected.length} alerjen seçildi — bu malzemeleri içeren tarifler uyarılacak
        </p>
      )}

      {/* Butonlar */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-2xl h-12"
        >
          ← Geri
        </Button>
        <Button
          onClick={handleFinish}
          className="flex-2 flex-grow rounded-2xl h-12 text-base font-semibold"
        >
          Profil Oluştur 🎉
        </Button>
      </div>
    </div>
  );
}
