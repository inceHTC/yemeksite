"use client";

import { motion } from "framer-motion";

// Bebekler için yaklaşık günlük referans değerler (6-12 ay, ortalama)
// Kaynak: WHO/EFSA infant DRI tabloları
const DAILY_REFERENCE: Record<string, { dv: number; unit: string; label: string; icon: string; color: string }> = {
  calories:  { dv: 800,  unit: "kcal", label: "Kalori",       icon: "🔥", color: "#FF6B6B" },
  protein:   { dv: 11,   unit: "g",    label: "Protein",      icon: "💪", color: "#4ECDC4" },
  carbs:     { dv: 95,   unit: "g",    label: "Karbonhidrat", icon: "🌾", color: "#FFE66D" },
  fat:       { dv: 30,   unit: "g",    label: "Yağ",          icon: "🫒", color: "#A8E6CF" },
  fiber:     { dv: 5,    unit: "g",    label: "Lif",          icon: "🥦", color: "#88D8B0" },
  iron:      { dv: 11,   unit: "mg",   label: "Demir",        icon: "⚡", color: "#E17055" },
  vitaminC:  { dv: 50,   unit: "mg",   label: "Vit-C",        icon: "🍊", color: "#FDCB6E" },
  vitaminA:  { dv: 400,  unit: "mcg",  label: "Vit-A",        icon: "🥕", color: "#FFA07A" },
  calcium:   { dv: 260,  unit: "mg",   label: "Kalsiyum",     icon: "🦷", color: "#74B9FF" },
  zinc:      { dv: 3,    unit: "mg",   label: "Çinko",        icon: "🛡️", color: "#A29BFE" },
};

function getLevel(pct: number): { label: string; color: string } {
  if (pct >= 30) return { label: "Yüksek",  color: "text-green-600 dark:text-green-400" };
  if (pct >= 15) return { label: "Orta",    color: "text-amber-600 dark:text-amber-400" };
  return            { label: "Düşük",   color: "text-muted-foreground" };
}

interface NutritionVisualProps {
  nutrition: Record<string, number>;
}

export function NutritionVisual({ nutrition }: NutritionVisualProps) {
  const entries = Object.entries(nutrition)
    .map(([key, value]) => {
      const ref = DAILY_REFERENCE[key];
      if (!ref || value == null) return null;
      const pct = Math.min(Math.round((value / ref.dv) * 100), 100);
      return { key, value, pct, ...ref };
    })
    .filter(Boolean) as Array<{
      key: string; value: number; pct: number;
      dv: number; unit: string; label: string; icon: string; color: string;
    }>;

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-[0.65rem] text-muted-foreground/60 text-right">
        *Günlük önerilen değerin %'si (6–12 ay)
      </p>
      {entries.map((entry, i) => {
        const level = getLevel(entry.pct);
        return (
          <div key={entry.key} className="flex items-center gap-3">
            {/* İkon */}
            <span className="text-lg w-7 text-center shrink-0" role="img" aria-label={entry.label}>
              {entry.icon}
            </span>

            {/* Bar + etiket */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground/80">{entry.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold tabular-nums">
                    {entry.value}{entry.unit}
                  </span>
                  <span className={`text-[0.65rem] font-medium ${level.color}`}>
                    {level.label}
                  </span>
                </div>
              </div>

              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: entry.color, opacity: 0.75 }}
                  initial={{ width: 0 }}
                  animate={{ width: `${entry.pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* % */}
            <span className="text-xs font-semibold text-muted-foreground tabular-nums w-9 text-right shrink-0">
              {entry.pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
