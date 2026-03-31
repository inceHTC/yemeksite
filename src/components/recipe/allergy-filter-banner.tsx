"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ShieldAlert, X } from "lucide-react";
import { useBabyStore } from "@/store/baby-store";
import type { Allergen } from "@/store/baby-store";

// Alerjen → tarif diet filtresi eşleştirmesi
const ALLERGEN_TO_FILTER: Partial<Record<Allergen, string>> = {
  dairy: "dairy_free",
  gluten: "gluten_free",
};

const ALLERGEN_LABEL: Record<Allergen, string> = {
  dairy: "Süt",
  egg: "Yumurta",
  gluten: "Gluten",
  nuts: "Kuruyemiş",
  fish: "Balık",
  soy: "Soya",
  sesame: "Susam",
};

export function AllergyFilterBanner() {
  const { baby, onboardingCompleted } = useBabyStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allergies = baby.allergies ?? [];

  // Filtrelenebilir alerjiler (tarif flag'i olanlar)
  const filterableAllergies = allergies.filter((a) => ALLERGEN_TO_FILTER[a]);
  // Sadece uyarı gösterilenler (flag'i olmayanlar: egg, nuts, fish, soy, sesame)
  const warnOnlyAllergies = allergies.filter((a) => !ALLERGEN_TO_FILTER[a]);

  // Otomatik filtre uygula
  useEffect(() => {
    if (!onboardingCompleted || !filterableAllergies.length) return;

    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    filterableAllergies.forEach((a) => {
      const filter = ALLERGEN_TO_FILTER[a]!;
      if (!params.getAll("diet").includes(filter)) {
        params.append("diet", filter);
        changed = true;
      }
    });

    if (changed) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingCompleted]);

  if (!onboardingCompleted || !allergies.length) return null;

  function clearAllergyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    filterableAllergies.forEach((a) => {
      const filter = ALLERGEN_TO_FILTER[a]!;
      const current = params.getAll("diet").filter((v) => v !== filter);
      params.delete("diet");
      current.forEach((v) => params.append("diet", v));
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl px-4 py-3 mb-4">
      <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
          {baby.name ? `${baby.name} için` : "Bebeğiniz için"} alerji koruması aktif
        </p>
        <p className="text-xs text-amber-700/70 dark:text-amber-400/70 mt-0.5 leading-relaxed">
          {filterableAllergies.length > 0 && (
            <span>
              <strong>{filterableAllergies.map((a) => ALLERGEN_LABEL[a]).join(", ")}</strong> içeren tarifler otomatik filtrelendi.{" "}
            </span>
          )}
          {warnOnlyAllergies.length > 0 && (
            <span>
              <strong>{warnOnlyAllergies.map((a) => ALLERGEN_LABEL[a]).join(", ")}</strong> alerjisi için tarifleri kontrol edin.
            </span>
          )}
        </p>
      </div>
      {filterableAllergies.length > 0 && (
        <button
          onClick={clearAllergyFilters}
          className="shrink-0 text-amber-600/60 hover:text-amber-800 transition-colors"
          title="Alerji filtresini kaldır"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
