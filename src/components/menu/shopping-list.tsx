"use client";

import { useState } from "react";
import { Check, ChevronLeft, Share2, Copy, Printer, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useMenuStore } from "@/store/menu-store";

interface Ingredient {
  recipe_id: string;
  name: string;
  amount: number;
  unit: string;
}

interface Props {
  ingredients: Ingredient[];
}

export function ShoppingList({ ingredients }: Props) {
  const { plan } = useMenuStore();
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const totalMeals = Object.values(plan).reduce(
    (sum, day) => sum + Object.keys(day).length, 0
  );

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  // Malzemeleri grupla: aynı isim + birim olanları topla
  const grouped = ingredients.reduce<Record<string, { amount: number; unit: string }>>((acc, ing) => {
    const key = `${ing.name.toLowerCase().trim()}__${ing.unit}`;
    if (!acc[key]) acc[key] = { amount: 0, unit: ing.unit };
    acc[key].amount += ing.amount;
    return acc;
  }, {});

  const items = Object.entries(grouped).map(([key, val]) => ({
    key,
    name: key.split("__")[0],
    amount: val.amount,
    unit: val.unit,
  }));

  const done = items.filter((i) => checked.has(i.key)).length;

  function buildText() {
    const lines = items.map(
      (i) => `• ${i.name.charAt(0).toUpperCase() + i.name.slice(1)} — ${i.amount % 1 === 0 ? i.amount : i.amount.toFixed(1)} ${i.unit}`
    );
    return `🛒 Tok Bebek Alışveriş Listesi\n\n${lines.join("\n")}\n\ntokbebek.com.tr`;
  }

  async function handleShare() {
    const text = buildText();
    if (navigator.share) {
      await navigator.share({ title: "Alışveriş Listesi", text });
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <Link href="/menu" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Menüye Dön
        </Link>
        <p className="text-sm text-muted-foreground">{done}/{items.length} tamamlandı</p>
      </div>

      {items.length > 0 && (
        <div className="flex gap-2 mb-5 print:hidden">
          <button onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-primary text-white py-2.5 text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95">
            <Share2 className="w-4 h-4" />
            Paylaş
          </button>
          <button onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-all active:scale-95">
            {copied ? <CheckCheck className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            {copied ? "Kopyalandı!" : "Kopyala"}
          </button>
          <button onClick={handlePrint}
            className="hidden sm:flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-muted transition-all active:scale-95">
            <Printer className="w-4 h-4" />
            Yazdır
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Menüde henüz tarif yok.</p>
          <Link href="/menu" className="text-sm text-primary hover:underline">Menüye git →</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => toggle(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left ${
                checked.has(item.key)
                  ? "bg-muted/50 border-border opacity-50"
                  : "bg-card border-border hover:border-primary/30"
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                checked.has(item.key)
                  ? "bg-primary border-primary"
                  : "border-muted-foreground/30"
              }`}>
                {checked.has(item.key) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className={`flex-1 text-sm font-medium capitalize ${checked.has(item.key) ? "line-through text-muted-foreground" : ""}`}>
                {item.name}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">
                {item.amount % 1 === 0 ? item.amount : item.amount.toFixed(1)} {item.unit}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">{totalMeals} öğün · {items.length} malzeme</p>
      </div>
    </div>
  );
}
