"use client";

import Link from "next/link";
import { useBabyStore } from "@/store/baby-store";
import { computeAge } from "@/lib/age";

export function BabyChip() {
  const { baby, onboardingCompleted } = useBabyStore();
  const age = baby.birthDate ? computeAge(baby.birthDate) : null;

  if (!onboardingCompleted || !baby.name) return null;

  return (
    <Link
      href="/profil"
      className="hidden sm:flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/15 hover:border-primary/50 transition-colors"
    >
      <span className="text-base leading-none">👶</span>
      <span>{baby.name}</span>
      {age && <span className="text-xs font-normal text-primary/70">· {age.label}</span>}
    </Link>
  );
}
