"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { computeAge, STAGE_LABELS } from "@/lib/age";

interface StepBirthDateProps {
  value: string;
  onChange: (date: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepBirthDate({ value, onChange, onNext, onBack }: StepBirthDateProps) {
  const [localDate, setLocalDate] = useState(value);

  const age = localDate ? computeAge(localDate) : null;

  const today = new Date().toISOString().split("T")[0];
  // En fazla 3 yıl geriye git
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 3);
  const minDateStr = minDate.toISOString().split("T")[0];

  function handleNext() {
    if (!localDate || !age) return;
    onChange(localDate);
    onNext();
  }

  return (
    <div className="space-y-6">
      {/* İkon + başlık */}
      <div className="text-center">
        <span className="text-6xl">🎂</span>
        <h2 className="font-heading text-2xl font-bold mt-3">
          Doğum tarihi nedir?
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Bebeğinizin tam yaşına göre tarifler önereceğiz.
        </p>
      </div>

      {/* Tarih seçici */}
      <div>
        <input
          type="date"
          value={localDate}
          onChange={(e) => setLocalDate(e.target.value)}
          max={today}
          min={minDateStr}
          className="w-full rounded-2xl border border-border bg-background px-3 py-3 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
        />
      </div>

      {/* Yaş önizleme */}
      {age && (
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center space-y-1">
          <p className="text-2xl font-heading font-bold text-primary">
            {age.label}
          </p>
          <p className="text-sm text-muted-foreground">
            {STAGE_LABELS[age.stage]}
          </p>
        </div>
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
          onClick={handleNext}
          disabled={!localDate || !age}
          className="flex-2 flex-grow rounded-2xl h-12 text-base font-semibold"
        >
          Devam Et →
        </Button>
      </div>
    </div>
  );
}
