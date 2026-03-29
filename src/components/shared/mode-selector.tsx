"use client";

import { useBabyStore, type HealthMode } from "@/store/baby-store";
import { cn } from "@/lib/utils";

const modes: { value: HealthMode; label: string; emoji: string; description: string; themeClass: string }[] = [
  {
    value: "normal",
    label: "Normal",
    emoji: "😊",
    description: "Her şey yolunda",
    themeClass: "",
  },
  {
    value: "teething",
    label: "Diş Çıkarıyor",
    emoji: "🧊",
    description: "Serinletici tarifler",
    themeClass: "mode-teething",
  },
  {
    value: "gassy",
    label: "Gazlı",
    emoji: "💨",
    description: "Gaz dostu tarifler",
    themeClass: "mode-gassy",
  },
  {
    value: "picky",
    label: "İştahsız",
    emoji: "🎨",
    description: "Renkli & çekici",
    themeClass: "mode-picky",
  },
];

export function ModeSelector() {
  const { healthMode, setHealthMode } = useBabyStore();

  function handleSelect(mode: HealthMode, themeClass: string) {
    setHealthMode(mode);
    // Mod sınıfını <html> elementine uygula
    const html = document.documentElement;
    html.classList.remove("mode-teething", "mode-gassy", "mode-picky");
    if (themeClass) html.classList.add(themeClass);
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Şu an nasılız?</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            onClick={() => handleSelect(mode.value, mode.themeClass)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-2xl border-2 p-3 text-center transition-all hover:scale-105",
              healthMode === mode.value
                ? "border-primary bg-primary/10 text-primary scale-105"
                : "border-border bg-card hover:bg-muted"
            )}
          >
            <span className="text-2xl">{mode.emoji}</span>
            <span className="text-xs font-semibold leading-tight">{mode.label}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{mode.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
