"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
// Button burada doğrudan kullanılıyor (asChild değil)

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Temayı değiştir"
    >
      <span className="text-lg">
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </Button>
  );
}
