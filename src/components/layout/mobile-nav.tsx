"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Search, LifeBuoy, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Ana Sayfa", icon: Home, exact: true },
  { href: "/tarifler", label: "Tarifler", icon: BookOpen, exact: false },
  { href: "/ara", label: "Ara", icon: Search, exact: false },
  { href: "/destek", label: "Çözüm", icon: LifeBuoy, exact: false },
  { href: "/favorilerim", label: "Favoriler", icon: Heart, exact: false },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 sm:hidden">
      {/* Safe area for devices with home indicator */}
      <div className="grid grid-cols-5 pb-safe">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href) && item.href !== "/";
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 py-2.5 transition-colors touch-target"
            >
              <span
                className={cn(
                  "flex items-center justify-center w-10 h-[30px] rounded-full transition-all duration-200",
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "w-5 h-5" : "w-[18px] h-[18px]"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
