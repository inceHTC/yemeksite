"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { computeAge, STAGE_LABELS } from "@/lib/age";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface StepCompleteProps {
  name: string;
  birthDate: string;
  destination: string;
}

export function StepComplete({ name, birthDate, destination }: StepCompleteProps) {
  const age = computeAge(birthDate);
  const [confetti, setConfetti] = useState<{ id: number; x: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#00B894", "#a29bfe", "#fd79a8"];
    setConfetti(
      Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[i % colors.length],
        delay: Math.random() * 0.5,
      }))
    );
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto text-center space-y-6 py-8">
      {/* Konfeti */}
      <div className="relative h-24 overflow-hidden pointer-events-none">
        {confetti.map((c) => (
          <motion.div
            key={c.id}
            className="absolute top-0 w-2.5 h-2.5 rounded-sm"
            style={{ left: `${c.x}%`, backgroundColor: c.color }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: 120, opacity: 0, rotate: 360 }}
            transition={{ duration: 1.6, delay: c.delay, ease: "easeIn" }}
          />
        ))}
      </div>

      {/* Ana mesaj */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="space-y-3"
      >
        <span className="text-7xl">🎉</span>
        <h2 className="font-heading text-3xl font-bold">
          Hoş geldin, {name}!
        </h2>
        {age && (
          <div className="inline-block rounded-full bg-primary/10 px-4 py-2">
            <p className="text-primary font-semibold">
              {age.label} · {STAGE_LABELS[age.stage]}
            </p>
          </div>
        )}
        <p className="text-muted-foreground">
          Profil oluşturuldu! Sana özel tarifler seni bekliyor.
        </p>
      </motion.div>

      {/* Buton */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href={destination}
          className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-8 py-3 text-base font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-lg shadow-primary/25"
        >
          Tarifleri Keşfet
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  );
}
