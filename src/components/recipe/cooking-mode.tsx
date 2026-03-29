"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
interface RecipeStep {
  id?: string;
  text?: string;
  instruction?: string;
  step_number?: number;
  duration_min?: number;
  timer_seconds?: number;
}

interface CookingModeProps {
  steps: RecipeStep[];
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m > 0 && s > 0) return `${m} dk ${s} sn`;
  if (m > 0) return `${m} dk`;
  return `${s} sn`;
}

function StepItem({ step, checked, onCheck }: { step: RecipeStep; checked: boolean; onCheck: () => void }) {
  return (
    <motion.div
      layout
      className={cn(
        "flex gap-4 p-4 rounded-2xl border cursor-pointer transition-colors duration-200",
        checked
          ? "bg-muted/60 border-border/40"
          : "bg-card border-border hover:border-primary/30 hover:bg-muted/30"
      )}
      onClick={onCheck}
    >
      <div className="shrink-0 mt-0.5">
        <AnimatePresence mode="wait">
          {checked ? (
            <motion.div key="checked" initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </motion.div>
          ) : (
            <motion.div key="unchecked" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
              <Circle className="w-5 h-5 text-border" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 space-y-1.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
          Adım {step.step_number}
        </p>
        <p className={cn(
          "text-sm leading-relaxed",
          checked && "line-through text-muted-foreground"
        )}>
          {step.instruction}
        </p>
        {step.timer_seconds != null && step.timer_seconds > 0 && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Clock className="w-3.5 h-3.5" />
            {formatTimer(step.timer_seconds)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function CookingMode({ steps }: CookingModeProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  // WakeLock — pişirme sırasında ekranı açık tut
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    async function acquire() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Desteklenmiyor ya da reddedildi — graceful degradation
      }
    }
    acquire();
    const onVisibilityChange = () => { if (document.visibilityState === "visible") acquire(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      wakeLock?.release();
    };
  }, []);

  const toggle = (stepNumber: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(stepNumber) ? next.delete(stepNumber) : next.add(stepNumber);
      return next;
    });
  };

  const progress = steps.length > 0 ? Math.round((checked.size / steps.length) * 100) : 0;

  return (
    <div className="space-y-3">
      {steps.length > 1 && (
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
            {checked.size}/{steps.length}
          </span>
        </div>
      )}

      {steps.map((step, i) => (
        <StepItem
          key={step.id ?? i}
          step={step}
          checked={checked.has(step.step_number ?? i)}
          onCheck={() => toggle(step.step_number ?? i)}
        />
      ))}
    </div>
  );
}
