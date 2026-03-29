"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const AGE_OPTIONS = [
  { label: "4–6 ay", min: 4, max: 6 },
  { label: "6–8 ay", min: 6, max: 8 },
  { label: "9–12 ay", min: 9, max: 12 },
  { label: "12–18 ay", min: 12, max: 18 },
  { label: "18–24 ay", min: 18, max: 24 },
  { label: "24–36 ay", min: 24, max: 36 },
];

const MEAL_OPTIONS = [
  { value: "puree", label: "🥣 Püreler" },
  { value: "breakfast", label: "☀️ Kahvaltı" },
  { value: "lunch", label: "🍲 Öğle" },
  { value: "dinner", label: "🌙 Akşam" },
  { value: "snack", label: "🍎 Ara Öğün" },
];

const HEALTH_OPTIONS = [
  { value: "gas_friendly", label: "💨 Gaz Dostu" },
  { value: "constipation", label: "🌿 Kabızlık Önleyici" },
  { value: "immunity", label: "🛡️ Bağışıklık" },
  { value: "teething", label: "🧊 Diş Rahatlatıcı" },
];

const DIET_OPTIONS = [
  { value: "dairy_free", label: "Sütsüz" },
  { value: "gluten_free", label: "Glutensiz" },
  { value: "sugar_free", label: "Şekersiz" },
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-white"
          : "border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
      )}
    >
      {children}
    </button>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export function RecipeFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.getAll(key);
      if (current.includes(value)) {
        params.delete(key);
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const ageMin = searchParams.get("ageMin");
  const ageMax = searchParams.get("ageMax");
  const meal = searchParams.get("meal");
  const health = searchParams.getAll("health");
  const diet = searchParams.getAll("diet");
  const freezable = searchParams.get("freezable");

  const hasFilters = ageMin || meal || health.length || diet.length || freezable;

  return (
    <div className="space-y-4">
      <FilterSection label="Yaş">
        {AGE_OPTIONS.map((opt) => {
          const active = ageMin === String(opt.min) && ageMax === String(opt.max);
          return (
            <Chip
              key={opt.label}
              active={active}
              onClick={() => {
                if (active) {
                  updateParam("ageMin", null);
                  updateParam("ageMax", null);
                } else {
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("ageMin", String(opt.min));
                  params.set("ageMax", String(opt.max));
                  params.delete("page");
                  router.push(`${pathname}?${params.toString()}`);
                }
              }}
            >
              {opt.label}
            </Chip>
          );
        })}
      </FilterSection>

      <FilterSection label="Öğün">
        {MEAL_OPTIONS.map((opt) => (
          <Chip key={opt.value} active={meal === opt.value} onClick={() => updateParam("meal", meal === opt.value ? null : opt.value)}>
            {opt.label}
          </Chip>
        ))}
      </FilterSection>

      <FilterSection label="Durum">
        {HEALTH_OPTIONS.map((opt) => (
          <Chip key={opt.value} active={health.includes(opt.value)} onClick={() => toggleArrayParam("health", opt.value)}>
            {opt.label}
          </Chip>
        ))}
      </FilterSection>

      <FilterSection label="Diyet">
        {DIET_OPTIONS.map((opt) => (
          <Chip key={opt.value} active={diet.includes(opt.value)} onClick={() => toggleArrayParam("diet", opt.value)}>
            {opt.label}
          </Chip>
        ))}
        <Chip active={freezable === "true"} onClick={() => updateParam("freezable", freezable === "true" ? null : "true")}>
          ❄️ Dondurulabilir
        </Chip>
      </FilterSection>

      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-3 h-3" />
          Temizle
        </button>
      )}
    </div>
  );
}
