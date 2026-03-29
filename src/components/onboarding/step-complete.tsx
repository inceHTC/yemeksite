"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { computeAge, STAGE_LABELS } from "@/lib/age";

interface StepCompleteProps {
  name: string;
  birthDate: string;
}

export function StepComplete({ name, birthDate }: StepCompleteProps) {
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
          Profil oluşturuldu! Sana özel tarifler hazırlanıyor...
        </p>
      </motion.div>

      {/* Loading dots */}
      <div className="flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="size-2 rounded-full bg-primary"
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
