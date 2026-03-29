"use client";

// Vibrasyon pattern'leri (ms cinsinden)
const PATTERNS = {
  light: [10],
  medium: [30],
  success: [10, 50, 10],
  error: [50, 30, 50],
} as const;

type HapticPattern = keyof typeof PATTERNS;

function vibrate(pattern: HapticPattern) {
  if (typeof navigator === "undefined") return;
  if (!("vibrate" in navigator)) return;
  try {
    navigator.vibrate(PATTERNS[pattern]);
  } catch {
    // Desteklenmiyor — sessizce geç
  }
}

export function useHaptic() {
  return {
    light: () => vibrate("light"),
    medium: () => vibrate("medium"),
    success: () => vibrate("success"),
    error: () => vibrate("error"),
  };
}
