"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Gender = "girl" | "boy";

interface StepNameProps {
  value: string;
  gender: Gender;
  onChange: (name: string, gender: Gender) => void;
  onNext: () => void;
}

const genderOptions: { value: Gender; label: string; emoji: string; color: string }[] = [
  { value: "girl", label: "Kız", emoji: "👧", color: "border-pink-300 bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300" },
  { value: "boy", label: "Erkek", emoji: "👦", color: "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
];

export function StepName({ value, gender, onChange, onNext }: StepNameProps) {
  const [localName, setLocalName] = useState(value);
  const [localGender, setLocalGender] = useState<Gender>(gender);

  function handleNext() {
    if (!localName.trim()) return;
    onChange(localName.trim(), localGender);
    onNext();
  }

  // 🔥 sadeleştirildi
  const babyEmoji = localGender === "girl" ? "👧" : "👦";

  return (
    <div className="space-y-6">
      {/* İkon */}
      <div className="text-center">
        <span className="text-6xl">{babyEmoji}</span>
        <h2 className="font-heading text-2xl font-bold mt-3">
          Bebeğinizin adı nedir?
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Tarifleri ve içerikleri bebeğinize göre kişiselleştireceğiz.
        </p>
      </div>

      {/* İsim input */}
      <div>
        <input
          type="text"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleNext()}
          placeholder="Örn: Defne, Emir, Zeynep..."
          maxLength={30}
          autoFocus
          className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      {/* Cinsiyet */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Cinsiyet (opsiyonel)
        </p>
        <div className="grid grid-cols-2 gap-2"> {/* 3 → 2 yaptım */}
          {genderOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLocalGender(opt.value)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-sm font-medium transition-all ${
                localGender === opt.value
                  ? opt.color + " border-current scale-105"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-xs">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* İleri butonu */}
      <Button
        onClick={handleNext}
        disabled={!localName.trim()}
        className="w-full rounded-2xl h-12 text-base font-semibold"
      >
        Devam Et →
      </Button>
    </div>
  );
}