"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const CATEGORIES = [
  { value: "", label: "Tümü" },
  { value: "nutrition", label: "Beslenme" },
  { value: "health", label: "Sağlık" },
  { value: "development", label: "Gelişim" },
  { value: "safety", label: "Güvenlik" },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const current = searchParams.get("kategori") ?? "";

  function select(val: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (val) params.set("kategori", val);
    else params.delete("kategori");
    startTransition(() => {
      router.push(`/akademi?${params.toString()}`, { scroll: false });
    });
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => select(cat.value)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            current === cat.value
              ? "bg-primary text-white shadow-sm"
              : "border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
