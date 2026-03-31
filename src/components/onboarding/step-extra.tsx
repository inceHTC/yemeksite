"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { FeedingType } from "@/store/baby-store";

const FEEDING_OPTIONS: { value: FeedingType; label: string; emoji: string }[] = [
  { value: "breast",  label: "Anne Sütü",   emoji: "🤱" },
  { value: "formula", label: "Mama",        emoji: "🍼" },
  { value: "mixed",   label: "Karma",       emoji: "💛" },
];

const HEALTH_OPTIONS = [
  { value: "normal",   label: "Normal",          emoji: "😊", desc: "Her şey yolunda" },
  { value: "teething", label: "Diş Çıkarıyor",   emoji: "🦷", desc: "Diş kaşıma dönemi" },
  { value: "gassy",    label: "Gaz Sancısı",     emoji: "😣", desc: "Gaz ve şişkinlik var" },
  { value: "picky",    label: "Seçici Yiyor",    emoji: "🙅", desc: "Yeni tatları reddediyor" },
];

interface StepExtraProps {
  feedingType: FeedingType;
  healthMode: string;
  onChange: (data: { feedingType: FeedingType; healthMode: string; parentName: string }) => void;
  onFinish: (data: { feedingType: FeedingType; healthMode: string; parentName: string }) => void;
  onBack: () => void;
}

export function StepExtra({ feedingType, healthMode, onChange, onFinish, onBack }: StepExtraProps) {
  const [feeding, setFeeding] = useState<FeedingType>(feedingType);
  const [health, setHealth] = useState(healthMode || "normal");

  function handleFinish() {
    const data = { feedingType: feeding, healthMode: health, parentName: "" };
    onChange(data);
    onFinish(data);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="text-6xl">💬</span>
        <h2 className="font-heading text-2xl font-bold mt-3">Bir şey daha...</h2>
        <p className="text-muted-foreground text-sm mt-1">Bu bilgiler daha iyi tarif önerileri için kullanılır.</p>
      </div>

      {/* Besleme tipi */}
      <div>
        <p className="text-sm font-semibold mb-2">Besleme şekli</p>
        <div className="grid grid-cols-3 gap-2">
          {FEEDING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFeeding(opt.value)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all ${
                feeding === opt.value
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <p className="text-xs font-semibold leading-tight">{opt.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Şu anki durum */}
      <div>
        <p className="text-sm font-semibold mb-2">Şu anki durumu</p>
        <div className="grid grid-cols-2 gap-2">
          {HEALTH_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setHealth(opt.value)}
              className={`flex items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition-all ${
                health === opt.value
                  ? "border-primary bg-primary/8"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              <span className="text-xl shrink-0">{opt.emoji}</span>
              <div>
                <p className={`text-xs font-semibold ${health === opt.value ? "text-primary" : ""}`}>{opt.label}</p>
                <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-2xl h-12">
          ← Geri
        </Button>
        <Button onClick={handleFinish} className="flex-grow rounded-2xl h-12 text-base font-semibold">
          Profil Oluştur 🎉
        </Button>
      </div>
    </div>
  );
}
