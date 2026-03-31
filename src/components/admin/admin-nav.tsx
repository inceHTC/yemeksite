"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UtensilsCrossed, PlusCircle, BookOpen, FilePlus2, ChevronRight, MessageSquare } from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Genel",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Tarifler",
    items: [
      { href: "/admin/tarifler", label: "Tüm Tarifler", icon: UtensilsCrossed, exact: false },
      { href: "/admin/tarifler/yeni", label: "Yeni Tarif", icon: PlusCircle, exact: true },
    ],
  },
  {
    label: "Dergi",
    items: [
      { href: "/admin/akademi", label: "Tüm Makaleler", icon: BookOpen, exact: false },
      { href: "/admin/akademi/yeni", label: "Yeni Makale", icon: FilePlus2, exact: true },
    ],
  },
  {
    label: "Topluluk",
    items: [
      { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare, exact: false },
    ],
  },
];

export function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    if (href === "/admin/tarifler") return pathname.startsWith(href) && pathname !== "/admin/tarifler/yeni";
    if (href === "/admin/akademi") return pathname.startsWith(href) && pathname !== "/admin/akademi/yeni";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex-1 py-4 px-3 space-y-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {section.label}
          </p>
          <div className="space-y-0.5">
            {section.items.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? "text-primary" : ""}`} />
                  {label}
                  {active ? (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  ) : (
                    <ChevronRight className="ml-auto w-3 h-3 opacity-0 group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
